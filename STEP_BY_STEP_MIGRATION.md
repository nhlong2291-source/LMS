# 📖 HƯỚNG DẪN MIGRATION CHI TIẾT - TỪNG BƯỚC

## 🎯 Tổng quan

Hướng dẫn này sẽ giúp bạn migrate **từng feature một cách có hệ thống**, không ảnh hưởng đến code cũ đang chạy.

---

## ⚙️ BƯỚC 0: SETUP BAN ĐẦU (10 phút)

### **1. Tạo file `.env`**

```bash
# Copy từ example
cp .env.example .env
```

Mở `.env` và update:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### **2. Verify Path Aliases**

Kiểm tra `tsconfig.json` có extend paths không:

```json
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    // ...
  }
}
```

Nếu chưa có, thêm dòng `"extends": "./tsconfig.paths.json"` vào đầu file.

### **3. Test Imports**

Tạo file test:

```tsx
// /src/test-imports.tsx
import { CourseList, useCourses } from "@/features/courses";
import { EmptyState, LoadingState } from "@/shared/components/common";
import { apiClient } from "@/shared/utils";
import { formatDate, formatCurrency } from "@/shared/utils/formatters";

console.log("✅ All imports work!");
```

Chạy dev server và check console:

```bash
npm run dev
```

Nếu có lỗi TypeScript, restart:

- VS Code: `Cmd/Ctrl + Shift + P` → "Restart TS Server"

---

## 📚 BƯỚC 1: MIGRATE COURSES FEATURE (2 giờ)

### **1.1. Review Courses Example**

Đọc các files này theo thứ tự:

```
1. /src/features/courses/types/course.types.ts
2. /src/features/courses/services/courseService.ts
3. /src/features/courses/hooks/useCourses.ts
4. /src/features/courses/components/CourseCard.tsx
5. /src/features/courses/EXAMPLE_USAGE.tsx
```

### **1.2. Update Backend Routes**

Đảm bảo backend MVC có các routes sau:

```javascript
// Backend MVC routes
GET    /api/courses              // List courses
GET    /api/courses/:id          // Get single course
POST   /api/courses              // Create course (admin/instructor)
PUT    /api/courses/:id          // Update course
DELETE /api/courses/:id          // Delete course
GET    /api/courses/:id/lessons  // Get lessons
POST   /api/courses/:id/enroll   // Enroll in course
```

Test với curl:

```bash
curl http://localhost:3000/api/courses
```

### **1.3. Update Existing Course Pages**

**File cũ:** `/components/courses/CoursesPage.tsx`

**Cách migrate:**

```tsx
// BEFORE (OLD)
import { useState, useEffect } from "react";

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

```tsx
// AFTER (NEW) - Chỉ cần 5 dòng!
import { CourseList, useCourses } from "@/features/courses";

export function CoursesPage() {
  const { courses, loading, error } = useCourses({ autoFetch: true });

  return <CourseList courses={courses} loading={loading} error={error} />;
}
```

**✅ Lợi ích:**

- Code giảm từ ~30 dòng xuống 5 dòng
- Logic tái sử dụng được
- Type-safe
- Error handling tự động

### **1.4. Update Course Detail Page**

**File cũ:** `/components/courses/CourseDetail.tsx`

```tsx
// AFTER (NEW)
import { useCourse, useCourseEnrollment } from "@/features/courses";
import { LoadingState, EmptyState } from "@/shared/components/common";

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const { course, lessons, loading, error } = useCourse(courseId);
  const { isEnrolled, isPending, enroll, enrolling } = useCourseEnrollment(courseId);

  if (loading) return <LoadingState />;
  if (error) return <EmptyState title="Error" message={error.message} />;
  if (!course) return <EmptyState title="Course not found" />;

  return (
    <div>
      <h1>{course.title}</h1>

      {/* Enrollment Button */}
      {!isEnrolled && !isPending && (
        <button onClick={() => enroll()} disabled={enrolling}>
          Enroll Now
        </button>
      )}

      {/* Curriculum */}
      {lessons.map((lesson) => (
        <div key={lesson.id}>{lesson.title}</div>
      ))}
    </div>
  );
}
```

### **1.5. Test Migration**

```bash
# 1. Start backend
npm run backend:dev

# 2. Start frontend
npm run dev

# 3. Open browser và test:
- http://localhost:5173/courses
- Click vào 1 course
- Test enrollment
- Check console for errors
```

---

## 🎮 BƯỚC 2: MIGRATE QUIZ FEATURE (4 giờ)

### **2.1. Tạo Structure**

```bash
mkdir -p src/features/quiz/{components,hooks,services,types}
```

### **2.2. Define Types**

```tsx
// /src/features/quiz/types/quiz.types.ts
export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  duration: number; // minutes
  passingScore: number; // percentage
  maxAttempts: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  type: "multiple_choice" | "true_false" | "short_answer" | "essay";
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  points: number;
  order: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  passed: boolean;
  answers: QuizAnswer[];
  timeSpent: number; // seconds
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  points: number;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string | string[]>; // questionId → answer
}
```

### **2.3. Create Service**

```tsx
// /src/features/quiz/services/quizService.ts
import { apiClient } from "@/shared/utils/api";
import type { Quiz, QuizAttempt, QuizSubmission } from "../types/quiz.types";

class QuizService {
  async getQuiz(quizId: string): Promise<Quiz> {
    return apiClient.get<Quiz>(`/quizzes/${quizId}`);
  }

  async getQuizByLesson(lessonId: string): Promise<Quiz | null> {
    return apiClient.get<Quiz | null>(`/lessons/${lessonId}/quiz`);
  }

  async submitQuiz(data: QuizSubmission): Promise<QuizAttempt> {
    return apiClient.post<QuizAttempt>(`/quizzes/${data.quizId}/submit`, data);
  }

  async getMyAttempts(quizId: string): Promise<QuizAttempt[]> {
    return apiClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`);
  }

  async getAttemptDetail(attemptId: string): Promise<QuizAttempt> {
    return apiClient.get<QuizAttempt>(`/quiz-attempts/${attemptId}`);
  }
}

export const quizService = new QuizService();
```

### **2.4. Create Hooks**

```tsx
// /src/features/quiz/hooks/useQuiz.ts
import { useState, useEffect, useCallback } from "react";
import { quizService } from "../services/quizService";
import type { Quiz } from "../types/quiz.types";

export function useQuiz(quizId: string | undefined) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await quizService.getQuiz(quizId);
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch quiz"));
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return { quiz, loading, error, refetch: fetchQuiz };
}
```

```tsx
// /src/features/quiz/hooks/useQuizSubmission.ts
import { useState, useCallback } from "react";
import { quizService } from "../services/quizService";
import type { QuizSubmission, QuizAttempt } from "../types/quiz.types";

export function useQuizSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  const submit = useCallback(async (data: QuizSubmission) => {
    try {
      setSubmitting(true);
      setError(null);
      const attempt = await quizService.submitQuiz(data);
      setResult(attempt);
      return attempt;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to submit quiz");
      setError(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { submit, submitting, error, result, reset };
}
```

### **2.5. Create Components**

```tsx
// /src/features/quiz/components/QuizPlayer.tsx
import { useState } from "react";
import { useQuiz, useQuizSubmission } from "../hooks";
import { LoadingState, EmptyState } from "@/shared/components/common";
import { Button } from "@/components/ui/button";

interface QuizPlayerProps {
  quizId: string;
  onComplete?: (score: number) => void;
}

export function QuizPlayer({ quizId, onComplete }: QuizPlayerProps) {
  const { quiz, loading, error } = useQuiz(quizId);
  const { submit, submitting, result } = useQuizSubmission();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const attempt = await submit({ quizId, answers });
      onComplete?.(attempt.score);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading) return <LoadingState message="Loading quiz..." />;
  if (error) return <EmptyState title="Error" message={error.message} />;
  if (!quiz) return <EmptyState title="Quiz not found" />;

  // Show results if completed
  if (result) {
    return (
      <div className="p-8 bg-white rounded-lg">
        <h2 className="text-2xl mb-4">Quiz Completed!</h2>
        <p className="text-lg mb-2">Score: {result.score}%</p>
        <p className={result.passed ? "text-green-600" : "text-red-600"}>{result.passed ? "Passed ✓" : "Failed ✗"}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">{quiz.title}</h1>
      <p className="text-slate-600 mb-8">{quiz.description}</p>

      {/* Questions */}
      {quiz.questions.map((question, index) => (
        <div key={question.id} className="mb-8 p-6 bg-white rounded-lg border">
          <h3 className="text-lg mb-4">
            {index + 1}. {question.question}
          </h3>

          {question.type === "multiple_choice" && (
            <div className="space-y-2">
              {question.options?.map((option, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === "short_answer" && (
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            />
          )}
        </div>
      ))}

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={submitting || Object.keys(answers).length === 0} className="w-full">
        {submitting ? "Submitting..." : "Submit Quiz"}
      </Button>
    </div>
  );
}
```

### **2.6. Barrel Export**

```tsx
// /src/features/quiz/index.ts
export { QuizPlayer } from "./components/QuizPlayer";
export { useQuiz } from "./hooks/useQuiz";
export { useQuizSubmission } from "./hooks/useQuizSubmission";
export { quizService } from "./services/quizService";
export type { Quiz, Question, QuizAttempt, QuizSubmission } from "./types/quiz.types";
```

### **2.7. Update Existing Quiz Pages**

**File cũ:** `/components/courses/QuizInLesson.tsx`

```tsx
// AFTER (NEW)
import { QuizPlayer } from "@/features/quiz";

export function QuizInLesson({ lessonId }: { lessonId: string }) {
  // Old complex logic here...

  // Replace with:
  return (
    <QuizPlayer
      quizId={quizId}
      onComplete={(score) => {
        console.log("Quiz completed with score:", score);
        // Handle completion
      }}
    />
  );
}
```

---

## 🎯 BƯỚC 3: MIGRATE GAMIFICATION (6 giờ)

### **3.1. Tạo Structure**

```bash
mkdir -p src/features/gamification/{components/{badges,certificates,leaderboard,progress},hooks,services,types}
```

### **3.2. Define Types**

```tsx
// /src/features/gamification/types/gamification.types.ts

// LƯU Ý: BỎ HẾT XP SYSTEM
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "course" | "quiz" | "achievement";
  earnedAt?: string;
  progress?: number; // 0-100
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  issuedAt: string;
  certificateCode: string;
  pdfUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  // BỎ XP
  totalPoints: number; // Chỉ dùng points, không dùng XP
  coursesCompleted: number;
  badgesEarned: number;
}

export interface Progress {
  userId: string;
  // BỎ XP, CHỈ GIỮ POINTS
  totalPoints: number;
  streak: number;
  coursesCompleted: number;
  coursesInProgress: number;
  badgesEarned: number;
  certificatesEarned: number;
  currentLevel: number;
  nextLevelPoints: number;
}
```

### **3.3. Create Service**

```tsx
// /src/features/gamification/services/gamificationService.ts
import { apiClient } from "@/shared/utils/api";
import type { Badge, Certificate, LeaderboardEntry, Progress } from "../types/gamification.types";

class GamificationService {
  // Progress
  async getMyProgress(): Promise<Progress> {
    return apiClient.get<Progress>("/progress/me");
  }

  // Badges
  async getMyBadges(): Promise<Badge[]> {
    return apiClient.get<Badge[]>("/badges/me");
  }

  async getAllBadges(): Promise<Badge[]> {
    return apiClient.get<Badge[]>("/badges");
  }

  // Certificates
  async getMyCertificates(): Promise<Certificate[]> {
    return apiClient.get<Certificate[]>("/certificates/me");
  }

  async verifyCertificate(code: string): Promise<Certificate> {
    return apiClient.get<Certificate>(`/certificates/verify/${code}`);
  }

  // Leaderboard (BỎ XP)
  async getLeaderboard(period: "week" | "month" | "all" = "all"): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>("/leaderboard", { period });
  }
}

export const gamificationService = new GamificationService();
```

**Follow pattern tương tự để tạo hooks và components**

---

## 📝 PATTERN CHUNG CHO MỌI FEATURE

Mỗi feature follow 7 bước này:

### **1. Tạo folder structure**

```bash
mkdir -p src/features/{feature-name}/{components,hooks,services,types}
```

### **2. Define types** (`types/{feature}.types.ts`)

- Export tất cả interfaces
- Document mỗi field

### **3. Create service** (`services/{feature}Service.ts`)

- Class với methods cho CRUD
- Return typed responses
- Handle errors

### **4. Create hooks** (`hooks/use{Feature}.ts`)

- 1 hook = 1 responsibility
- Return `{ data, loading, error, refetch }`
- Use service internally

### **5. Create components** (`components/`)

- UI only, nhận props
- Use hooks cho data
- Clean và reusable

### **6. Barrel export** (`index.ts`)

```tsx
export * from "./components";
export * from "./hooks";
export * from "./services";
export type * from "./types";
```

### **7. Update existing pages**

- Import từ feature module
- Replace old logic với hooks
- Test thoroughly

---

## ✅ CHECKLIST CHO MỖI FEATURE

- [ ] Folder structure created
- [ ] Types defined và exported
- [ ] Service với CRUD methods
- [ ] Hooks với loading/error states
- [ ] Components UI only
- [ ] Barrel export complete
- [ ] Old pages updated
- [ ] Backend routes tested
- [ ] No TypeScript errors
- [ ] Manually tested
- [ ] README updated

---

## 🐛 TROUBLESHOOTING

### **Issue 1: Import errors**

```
Cannot find module '@/features/...'
```

**Fix:**

1. Check `tsconfig.paths.json` exists
2. Restart TypeScript: `Cmd/Ctrl + Shift + P` → Restart TS Server
3. Restart IDE

---

### **Issue 2: API 404**

```
GET /api/courses 404
```

**Fix:**

1. Check backend server running
2. Verify `VITE_API_BASE_URL` in `.env`
3. Test backend route directly với curl

---

### **Issue 3: CORS errors**

```
Access blocked by CORS policy
```

**Fix backend:**

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

---

## 📊 TRACKING PROGRESS

Tạo file tracking:

```markdown
# MIGRATION_PROGRESS.md

## Completed ✅

- [x] Setup (2024-11-30)
- [x] Courses Feature (2024-11-30)

## In Progress 🔄

- [ ] Quiz Feature (Started: 2024-12-01)

## Todo ⏳

- [ ] Gamification
- [ ] Auth
- [ ] Forum
- [ ] Library
- [ ] Live Classes

## Notes

- Remember to bỏ XP system
- Test sau mỗi feature
```

---

## 🎯 NEXT ACTIONS

### **Ngay bây giờ:**

1. ✅ Đọc hết guide này
2. ✅ Setup `.env`
3. ✅ Test Courses feature
4. ✅ Migrate Quiz feature (follow Bước 2)

### **Tuần này:**

1. Complete Quiz migration
2. Start Gamification (nhớ bỏ XP)
3. Update documentation

### **Tháng này:**

1. Complete all core features
2. Write tests
3. Deploy to staging

---

**Good luck! 🚀**

# 📋 QUICK REFERENCE - CHEAT SHEET

> Tham khảo nhanh các patterns và imports

---

## 📦 Import Patterns

### **Features:**

```tsx
// Courses
import { CourseList, useCourses, courseService, type Course } from "@/features/courses";

// Quiz (when ready)
import { QuizPlayer, useQuiz, quizService, type Quiz } from "@/features/quiz";

// Gamification (when ready)
import { BadgeCard, useBadges, type Badge } from "@/features/gamification";
```

### **Shared Components:**

```tsx
import { EmptyState, LoadingState, ErrorBoundary, Pagination } from "@/shared/components/common";
import { Button, Card, Input, Select } from "@/components/ui";
```

### **Shared Hooks:**

```tsx
import { useApi, useDebounce, useLocalStorage, useMediaQuery, usePagination } from "@/shared/hooks";
```

### **Shared Utils:**

```tsx
import { apiClient, formatDate, formatCurrency, isValidEmail, ROLES, ROUTES } from "@/shared/utils";
```

---

## 🎯 Common Patterns

### **Pattern 1: Simple List**

```tsx
import { CourseList, useCourses } from "@/features/courses";

export function CoursesPage() {
  const { courses, loading, error } = useCourses({ autoFetch: true });
  return <CourseList courses={courses} loading={loading} error={error} />;
}
```

### **Pattern 2: With Filters**

```tsx
import { useCourses } from "@/features/courses";

export function FilteredCoursesPage() {
  const { courses, loading, updateFilters } = useCourses({
    initialFilters: { category: "programming" },
  });

  return (
    <div>
      <select onChange={(e) => updateFilters({ category: e.target.value })}>
        <option value="programming">Programming</option>
        <option value="design">Design</option>
      </select>
      {/* Render courses */}
    </div>
  );
}
```

### **Pattern 3: With Pagination**

```tsx
import { useCourses } from "@/features/courses";
import { Pagination } from "@/shared/components/common";

export function PaginatedCoursesPage() {
  const { courses, currentPage, totalPages, goToPage } = useCourses({ initialFilters: { limit: 12 } });

  return (
    <div>
      {/* Render courses */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
```

### **Pattern 4: Detail Page**

```tsx
import { useCourse, useCourseEnrollment } from "@/features/courses";
import { LoadingState, EmptyState } from "@/shared/components/common";

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const { course, lessons, loading, error } = useCourse(courseId);
  const { isEnrolled, enroll, enrolling } = useCourseEnrollment(courseId);

  if (loading) return <LoadingState />;
  if (error) return <EmptyState title="Error" message={error.message} />;
  if (!course) return <EmptyState title="Not found" />;

  return (
    <div>
      <h1>{course.title}</h1>
      {!isEnrolled && (
        <button onClick={() => enroll()} disabled={enrolling}>
          Enroll
        </button>
      )}
    </div>
  );
}
```

### **Pattern 5: Direct Service Call**

```tsx
import { courseService } from "@/features/courses";

async function createCourse() {
  const course = await courseService.createCourse({
    title: "New Course",
    description: "...",
    category: "programming",
  });
  console.log("Created:", course);
}
```

---

## 🔧 Utility Functions

### **Formatters:**

```tsx
import { formatDate, formatRelativeTime, formatCurrency, formatDuration, formatFileSize } from "@/shared/utils";

formatDate("2024-11-30"); // "30 Th11, 2024"
formatRelativeTime("2024-11-30"); // "2 giờ trước"
formatCurrency(99000); // "99.000 ₫"
formatDuration(125); // "2 giờ 5 phút"
formatFileSize(1024000); // "1 MB"
```

### **Validators:**

```tsx
import { isValidEmail, isValidPassword, isValidPhone, getPasswordStrength } from "@/shared/utils";

isValidEmail("test@example.com"); // true
isValidPassword("Abc12345"); // true
isValidPhone("0912345678"); // true
getPasswordStrength("Abc12345!"); // { score: 4, label: 'Rất mạnh' }
```

### **Constants:**

```tsx
import { ROLES, ROUTES, ENROLLMENT_STATUS } from "@/shared/utils";

const isAdmin = user.role === ROLES.ADMIN;
const loginUrl = ROUTES.LOGIN;
const isPending = enrollment.status === ENROLLMENT_STATUS.PENDING;
```

---

## 🪝 Hook Examples

### **useDebounce:**

```tsx
import { useDebounce } from "@/shared/hooks";

const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  // API call với debouncedSearch
}, [debouncedSearch]);
```

### **useLocalStorage:**

```tsx
import { useLocalStorage } from "@/shared/hooks";

const [theme, setTheme] = useLocalStorage("theme", "light");
// Auto sync với localStorage
```

### **useMediaQuery:**

```tsx
import { useIsMobile, useIsDesktop } from "@/shared/hooks";

const isMobile = useIsMobile();
const isDesktop = useIsDesktop();

return isMobile ? <MobileView /> : <DesktopView />;
```

### **usePagination:**

```tsx
import { usePagination } from "@/shared/hooks";

const { currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination({
  totalItems: 100,
  itemsPerPage: 10,
});
```

---

## 🏗️ Create New Feature (7 steps)

### **1. Create structure:**

```bash
mkdir -p src/features/{feature-name}/{components,hooks,services,types}
```

### **2. Define types:**

```tsx
// /src/features/{feature}/types/{feature}.types.ts
export interface MyEntity {
  id: string;
  name: string;
  // ...
}
```

### **3. Create service:**

```tsx
// /src/features/{feature}/services/{feature}Service.ts
import { apiClient } from "@/shared/utils/api";

class MyService {
  async getAll() {
    return apiClient.get("/my-entities");
  }
}

export const myService = new MyService();
```

### **4. Create hook:**

```tsx
// /src/features/{feature}/hooks/useMyEntities.ts
import { useState, useEffect } from "react";
import { myService } from "../services";

export function useMyEntities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myService
      .getAll()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
```

### **5. Create component:**

```tsx
// /src/features/{feature}/components/MyList.tsx
export function MyList({ items }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### **6. Barrel export:**

```tsx
// /src/features/{feature}/index.ts
export { MyList } from "./components/MyList";
export { useMyEntities } from "./hooks/useMyEntities";
export { myService } from "./services/myService";
export type { MyEntity } from "./types/my.types";
```

### **7. Use in page:**

```tsx
import { MyList, useMyEntities } from "@/features/{feature}";

export function MyPage() {
  const { data, loading } = useMyEntities();
  return <MyList items={data} />;
}
```

---

## 🐛 Common Errors & Fixes

### **Error: Cannot find module '@/features/...'**

```bash
# Fix: Restart TypeScript Server
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### **Error: GET /api/... 404**

```bash
# Fix 1: Check backend is running
npm run backend:dev

# Fix 2: Check .env
VITE_API_BASE_URL=http://localhost:3000/api

# Fix 3: Test backend directly
curl http://localhost:3000/api/courses
```

### **Error: CORS policy**

```javascript
// Fix: Add to backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

### **Error: Type '... | undefined' is not assignable**

```tsx
// Fix: Add null check
if (!data) return null;
// Or use optional chaining
return <div>{data?.name}</div>;
```

---

## 📊 Backend Routes Reference

### **Courses:**

```
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id
GET    /api/courses/:id/lessons
POST   /api/courses/:id/enroll
GET    /api/courses/:id/progress
```

### **Quiz:**

```
GET    /api/quizzes/:id
POST   /api/quizzes/:id/submit
GET    /api/quizzes/:id/attempts
```

### **Gamification (BỎ XP):**

```
GET    /api/progress/me
GET    /api/badges/me
GET    /api/certificates/me
GET    /api/leaderboard
```

---

## 📁 File Organization

```
/src/
├── features/           # Business features
│   ├── courses/       # ✅ DONE
│   ├── quiz/          # ⏳ Next
│   ├── gamification/  # ⏳ Next (BỎ XP)
│   └── ...
│
├── shared/            # Shared resources
│   ├── components/
│   ├── hooks/
│   └── utils/
│
└── modules/           # Role-based pages
    ├── student/
    ├── instructor/
    ├── manager/
    └── admin/
```

---

## ✅ Quick Checklist

**Before starting:**

- [ ] `.env` file configured
- [ ] Backend running
- [ ] Path aliases working
- [ ] No TypeScript errors

**When migrating feature:**

- [ ] Create folder structure
- [ ] Define types
- [ ] Create service
- [ ] Create hooks
- [ ] Create components
- [ ] Barrel export
- [ ] Test thoroughly

**After migrating:**

- [ ] Update old pages
- [ ] Remove old code
- [ ] Update docs
- [ ] Commit changes

---

## 🚀 Commands

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Build
npm run build

# Test imports
npm run test-imports
```

---

## 📚 Documentation Links

- **Quick Start:** `/QUICK_START.md`
- **Full Guide:** `/RESTRUCTURE_GUIDE.md`
- **Step by Step:** `/STEP_BY_STEP_MIGRATION.md`
- **Checklist:** `/MIGRATION_CHECKLIST.md`
- **Summary:** `/FINAL_SUMMARY.md`

---

**💡 Tip: Bookmark this file for quick reference!**

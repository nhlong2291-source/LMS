# ⚡ QUICK START GUIDE

## 🎯 Bắt đầu nhanh với Courses Feature Example

### **Bước 1: Setup Environment (2 phút)**

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Mở .env và update API URL
# VITE_API_BASE_URL=http://localhost:3000/api
```

---

### **Bước 2: Verify Path Aliases (1 phút)**

Check file `tsconfig.json` có extend `tsconfig.paths.json`:

```json
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    // ... other settings
  }
}
```

Nếu chưa có, thêm vào.

---

### **Bước 3: Test Import (2 phút)**

Tạo file test để verify imports hoạt động:

```tsx
// /src/test-courses.tsx
import { CourseList, useCourses } from "@/features/courses";
import { EmptyState, LoadingState } from "@/shared/components/common";

export function TestCoursesPage() {
  const { courses, loading, error } = useCourses({ autoFetch: false });

  if (loading) return <LoadingState message="Loading courses..." />;
  if (error) return <EmptyState title="Error" message={error.message} />;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-6">Courses Feature Test</h1>
      <CourseList courses={courses} loading={loading} error={error} />
    </div>
  );
}
```

**Chạy dev server:**

```bash
npm run dev
```

**Nếu có lỗi TypeScript:**

```bash
# Restart TypeScript server trong VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

### **Bước 4: Connect Backend (5 phút)**

**Backend cần implement các endpoints:**

```
GET /api/courses
Response: {
  courses: Course[],
  total: number,
  page: number,
  totalPages: number
}

GET /api/courses/:id
Response: Course

GET /api/courses/:id/lessons
Response: Lesson[]
```

**Test với Postman hoặc curl:**

```bash
curl http://localhost:3000/api/courses
```

---

### **Bước 5: Sử dụng trong Page thực (3 phút)**

```tsx
// Example: Student Dashboard
import { CourseList, useCourses } from "@/features/courses";

function StudentDashboard() {
  const { courses, loading, updateFilters } = useCourses({
    initialFilters: { limit: 6 },
    autoFetch: true,
  });

  return (
    <div>
      <h2>My Courses</h2>
      <CourseList courses={courses} loading={loading} columns={3} onCourseClick={(id) => navigate(`/courses/${id}`)} />
    </div>
  );
}
```

---

## 📋 Checklist

- [ ] Copy `.env.example` → `.env`
- [ ] Update `VITE_API_BASE_URL`
- [ ] Verify `tsconfig.paths.json` setup
- [ ] Test imports (no TypeScript errors)
- [ ] Backend API endpoints ready
- [ ] Test 1 page với Courses feature
- [ ] Verify data fetching hoạt động

---

## 🐛 Common Issues

### **1. Import errors**

```
Module not found: Can't resolve '@/features/courses'
```

**Fix:**

- Restart TypeScript server
- Check `tsconfig.paths.json` exists
- Check `tsconfig.json` extends it

---

### **2. API errors**

```
Failed to fetch: ERR_CONNECTION_REFUSED
```

**Fix:**

- Check backend server đang chạy
- Verify `VITE_API_BASE_URL` đúng
- Check CORS settings

---

### **3. TypeScript errors**

```
Type 'Course | undefined' is not assignable to type 'Course'
```

**Fix:**

- Add null checks: `if (!course) return null;`
- Use optional chaining: `course?.title`

---

## 📚 Next Steps

1. ✅ Test Courses feature hoạt động
2. ⏳ Đọc `/RESTRUCTURE_GUIDE.md` để hiểu chi tiết
3. ⏳ Xem `/src/features/courses/EXAMPLE_USAGE.tsx`
4. ⏳ Quyết định feature tiếp theo để migrate
5. ⏳ Follow `/MIGRATION_CHECKLIST.md`

---

## 🎯 Recommended Migration Order

1. **Auth** (đăng nhập/đăng ký) - Foundation
2. **Quiz** (đã có code) - Complex logic
3. **Gamification** (badges, certs, leaderboard) - Multiple sub-features
4. **Forum** - Moderate complexity
5. **Library, Live Classes, Exams, Surveys** - Simpler features

---

## 💡 Pro Tips

✅ **DO:**

- Test mỗi feature ngay sau khi migrate
- Commit thường xuyên với clear messages
- Follow pattern từ Courses example
- Document as you go

❌ **DON'T:**

- Migrate nhiều features cùng lúc
- Skip testing
- Change pattern giữa chừng
- Forget to update imports

---

## 🆘 Need Help?

1. Check `/RESTRUCTURE_GUIDE.md` - Detailed guide
2. Check `/src/features/courses/README.md` - Feature docs
3. Check `/src/features/courses/EXAMPLE_USAGE.tsx` - Code examples
4. Check `/MIGRATION_CHECKLIST.md` - Step-by-step checklist

---

**Total Setup Time:** ~15 phút  
**Ready to code!** 🚀

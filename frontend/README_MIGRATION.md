# Frontend TypeScript Migration - Quick Notes

This workspace has been prepared for a full TypeScript migration.

What I created for you:

- `tsconfig.json` and `tsconfig.paths.json` at project root
- Feature-based folders under `src/`:
  - `src/features/`
  - `src/shared/components/common/`
  - `src/shared/hooks/`
  - `src/shared/utils/`
  - `src/components/`
  - `src/modules/{student,instructor,manager,admin}`
  - `src/context/` and `src/layouts/`

Next steps you should follow (suggested):

1. Convert files to TypeScript incrementally. Rename one feature at a time from `.jsx`/.js to `.tsx`/.ts.
2. Install TypeScript and type packages:

```bash
# from frontend/ folder
npm install -D typescript @types/react @types/react-dom @types/node
```

3. Update `package.json` scripts if needed (add `type-check` script).
4. Fix type errors incrementally and run `npm run dev` to check runtime.

If you want, I can continue and:

- Convert selected files to `.tsx` and add typings
- Install the dev dependencies automatically
- Run the dev server and fix errors

Tell me which file or feature you want to migrate first and paste its code; I'll convert it to TypeScript and integrate it into the new structure.

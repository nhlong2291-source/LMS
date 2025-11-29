module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["src/controllers/**/*.js"],
      rules: {
        // Disallow direct use of the global `logger` object inside controller code.
        // Controllers should prefer the request-scoped logger when available:
        //   const log = req?.logger ?? logger;
        //   log.info(...)
        "no-restricted-syntax": [
          "error",
          {
            selector: "MemberExpression[object.name='logger']",
            message:
              "Do not call `logger.*` directly in controllers. Use `const log = req?.logger ?? logger;` then call `log.*` so logs include requestId when present.",
          },
        ],
      },
    },
  ],
};

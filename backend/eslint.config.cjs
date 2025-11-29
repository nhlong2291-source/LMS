module.exports = [
  {
    files: ["src/controllers/**/*.js"],
    rules: {
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
];

import eslintJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import eslintSimpleImportSort from "eslint-plugin-simple-import-sort";
import tsEslint from "@typescript-eslint/eslint-plugin";
import eslintPluginJest from "eslint-plugin-jest";
import globals from "globals";

const eslintConfig = [
  eslintJs.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
      "eslint-plugin-simple-import-sort": eslintSimpleImportSort,
      "@typescript-eslint": tsEslint,
      jest: eslintPluginJest,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      ".lintstagedrc.cjs",
      "public/**/*",
      ".prettierrc",
      "eslint.config.mjs",
      "coverage",
      "ts-coverage",
    ],
  },
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          args: "none",
          caughtErrors: "none",
        },
      ],
    },
  },
  {
    files: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts", "**/test/**.ts"],
    plugins: {
      jest: eslintPluginJest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
    },
  },
  {
    files: ["src/**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "array-callback-return": "warn",
      complexity: ["warn", 15],
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": 0,
      "no-nested-ternary": "warn",
      "no-relative-import-paths/no-relative-import-paths": "off",
      "no-unneeded-ternary": "warn",
      "eslint-plugin-simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^[a-z]"],
            ["^@"],
            ["^~"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
            ["^\\u0000"],
          ],
        },
      ],
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/expect-expect": "warn",
    },
  },
];

export default eslintConfig;

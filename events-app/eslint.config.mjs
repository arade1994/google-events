import eslintJs from "@eslint/js";
import tanstackPluginQuery from "@tanstack/eslint-plugin-query";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import reactHooks from "eslint-plugin-react-hooks";
import eslintSimpleImportSort from "eslint-plugin-simple-import-sort";
import tsEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
  eslintJs.configs.recommended,
  eslintConfigPrettier,
  ...tanstackPluginQuery.configs["flat/recommended"],
  {
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
      "react-hooks": reactHooks,
      "eslint-plugin-simple-import-sort": eslintSimpleImportSort,
      "@typescript-eslint": tsEslint,
      react,
      "jsx-a11y": jsxA11y,
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
        window: "readonly",
        document: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        fetch: "readonly",
        console: "readonly",
      },
    },
  },
  {
    ignores: [
      ".lintstagedrc.cjs",
      "public/**/*",
      ".prettierrc",
      "eslint.config.mjs",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
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
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: true,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react/jsx-uses-react": "off",
      "react/jsx-no-useless-fragment": [
        "error",
        {
          allowExpressions: true,
        },
      ],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      "array-callback-return": "warn",
      complexity: ["warn", 15],
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/no-autofocus": "warn",
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": 0,
      "no-nested-ternary": "warn",
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        {
          allowSameFolder: true,
          rootDir: "src",
        },
      ],
      "no-unneeded-ternary": "warn",
      "eslint-plugin-simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^[a-z]"],
            ["^@"],
            ["^~"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.s?css$"],
            ["^\\u0000"],
          ],
        },
      ],
    },
  },
];

export default eslintConfig;

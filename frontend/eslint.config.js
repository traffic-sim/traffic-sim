import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import boundaries from "eslint-plugin-boundaries";
import importX from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      prettierConfig,
    ],
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      boundaries,
      perfectionist,
    },
    settings: {
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/elements": [
        { type: "entities", pattern: "src/entities/*/**", capture: ["entity"] },
        { type: "components", pattern: "src/components/**" },
        { type: "theme", pattern: "src/theme/**" },
        { type: "feature", pattern: "src/*/**", capture: ["feature"] },
      ],
    },
    rules: {
      curly: ["error", "all"],
      "import-x/default": "off",
      "import-x/no-named-as-default-member": "off",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      eqeqeq: "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Warn if an import path includes a .ts/.tsx extension
      "import-x/extensions": [
        "warn",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
          fix: true,
        },
      ],

      "perfectionist/sort-imports": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "side-effect-style",
          ],
          newlinesBetween: 1,
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
        },
      ],

      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "entities" } },
              allow: { to: { element: { type: "entities" } } },
            },
            {
              from: { element: { type: "components" } },
              allow: [
                { to: { element: { type: "components" } } },
                { to: { element: { type: "theme" } } },
              ],
            },
            {
              from: { element: { type: "feature" } },
              allow: [
                { to: { element: { type: "entities" } } },
                { to: { element: { type: "components" } } },
                { to: { element: { type: "theme" } } },
                {
                  to: {
                    element: {
                      type: "feature",
                      captured: { feature: "{{ from.element.captured.feature }}" },
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "themes" } },
              allow: { to: { element: { type: "themes" } } },
            },
          ],
        },
      ],
    },
  }
);

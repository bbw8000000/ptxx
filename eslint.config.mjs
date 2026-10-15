import eslintPluginAstro from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    // 构建产物、本地缓存与本地工具目录一律不参与检查。
    // functions/ 全是 .ts，由 deploy-api 工作流里的 `tsc --noEmit` 负责类型与语法。
    ignores: [
      'dist/',
      'dist2/',
      'dist-new/',
      'dist_old/',
      'node_modules/',
      '.pages-dist/',
      '.astro/',
      '.wrangler/',
      '.venv-jcm/',
      '.wolf/',
      'test_write/',
      'public/hero/',
      'functions/',
    ],
  },
  ...eslintPluginAstro.configs.recommended,
  {
    // 脚本、测试与配置文件都是纯 JS：核心规则能真正兜住问题，
    // 尤其是重构后最容易残留的「定义了但没用」。
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      // 这些文件依赖 Node 全局，未引入 globals 包，交给运行时把关
      'no-undef': 'off',
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      // astro frontmatter 是 TypeScript：类型声明与泛型参数会被核心规则误报
      // （例如 `declare global` 里的 Window），这类检查交给 @astrojs/check。
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
]

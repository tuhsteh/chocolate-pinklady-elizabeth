import stylistic from '@stylistic/eslint-plugin';

export default [
  {
    ignores: ['./src/generated'],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': 'error',
    },
  },
];

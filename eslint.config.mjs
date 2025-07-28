import stylistic from '@stylistic/eslint-plugin';
import nodePkg from 'eslint-plugin-node';
const nodeConfigs = nodePkg.configs;
const nodeRules = nodePkg.rules;

export default [
  {
    ignores: [
      '.../build',
      '.../coverage',
      '.../dist',
      '.../generated',
      '.../node_modules',
      '.../prisma/migrations',
    ],
    plugins: {
      '@nodeConfigs': nodeConfigs,
      '@nodeRules': nodeRules,
      '@stylistic': stylistic,
    },
    rules: {
      '@nodeRules/export-style': 'off',

      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/brace-style': [ 'error', '1tbs' ],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
      '@stylistic/eol-last': [ 'error', 'always' ],
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/no-multiple-empty-lines': [ 'error', { max: 2, maxEOF: 2 } ],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
    },
  },
];

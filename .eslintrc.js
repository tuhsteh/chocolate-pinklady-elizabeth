import stylistic from '@stylistic/eslint-plugin';
import nodePkg from 'eslint-plugin-node';
const nodeConfigs = nodePkg.configs;
const nodeRules = nodePkg.rules;

export default [
  js.configs.recommended,
  nodeConfigs['recommended-module'],
  nodeConfigs['recommended-script'],
  nodeRules['file-extension-in-import'],
  nodeRules['no-unsupported-features/es-syntax'],
  nodeRules['handle-callback-err'],
  stylistic.configs.recommended,
];

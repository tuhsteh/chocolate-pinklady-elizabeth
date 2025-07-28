import stylistic from '@stylistic/eslint-plugin';
import alphabeticalPkg from 'stylelint-config-alphabetical-order';
import nodePkg from 'eslint-plugin-node';

const aoPlugins = alphabeticalPkg.plugins;
const aoRules = alphabeticalPkg.rules;
const nodeConfigs = nodePkg.configs;
const nodeRules = nodePkg.rules;

export default [
  aoPlugins['stylelint-order'],
  aoRules['order/order'],
  aoRules['order/properties-order'],
  js.configs.recommended,
  nodeConfigs['recommended-module'],
  nodeConfigs['recommended-script'],
  nodeRules['file-extension-in-import'],
  nodeRules['handle-callback-err'],
  nodeRules['no-unsupported-features/es-syntax'],
  stylistic.configs.recommended,
  stylistic.configs.alphabeticalPkg,
  stylistic.configs['recommended-javascript'],
];

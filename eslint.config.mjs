//import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';
//import tselint from '@typescript-eslint/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.husky/**',
      '**/infra/**',
      '**/*.config.js',
      'commitlint.config.js',
      'tsconfig*.json',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: globals.node,
    },
    plugins: {
      //hub: hub,
      '@typescript-eslint': tsPlugin,
    },
  },
];

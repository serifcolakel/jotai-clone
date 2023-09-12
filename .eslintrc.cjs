module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': [
      // ? https://eslint.org/docs/rules/max-len
      'error',
      {
        code: 150,
      },
    ],
    'padding-line-between-statements': [
      // ? https://eslint.org/docs/latest/rules/padding-line-between-statements
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'function'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: ['*'],
        next: ['if', 'switch', 'while', 'try', 'function'],
      },
      {
        blankLine: 'always',
        prev: ['if', 'switch', 'while', 'try', 'function'],
        next: ['*'],
      },
      {
        blankLine: 'always',
        prev: ['export'],
        next: ['*'],
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': 'error',
    'react/jsx-sort-props': [
      // ? https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
      'error',
      {
        shorthandFirst: true,
      },
    ],
    'react/require-default-props': ['off'],
    'no-else-return': 'error',
    // ? https://eslint.org/docs/rules/no-else-return
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};

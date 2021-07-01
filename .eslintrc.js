module.exports = {
  root: true,
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js'],
      },
    },
  },
  rules: {
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'react/prefer-stateless-function': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-filename-extension': 'off',
    'react/state-in-constructor': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'arrow-parens': 'off',
    'no-param-reassign': 'off',
    'brace-style': 'off',
  },
  globals: {
    window: true,
    document: true,
    navigator: true,
    localStorage: true,
    fetch: true,
  },
  env: {
    jest: true,
  },
  plugins: ['@babel'],
}

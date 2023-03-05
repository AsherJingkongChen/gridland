module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error'
  },
  parserOptions: {
    parser: 'typescript'
  }
};

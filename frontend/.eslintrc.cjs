module.exports = {
  extends: [
    '../.eslintrc.cjs',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-hooks'],
  env: { browser: true, es2020: true },
  settings: {
    react: { version: 'detect' },
  },
};

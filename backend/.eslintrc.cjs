module.exports = {
  extends: ['../.eslintrc.cjs', 'plugin:node/recommended'],
  env: { node: true },
  parserOptions: { ecmaVersion: 2020 },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: { jest: true },
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
  ],
};

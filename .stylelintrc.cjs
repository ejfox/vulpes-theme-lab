module.exports = {
  ignoreFiles: ['node_modules/**/*', 'dist/**/*', '.output/**/*', '.nuxt/**/*'],
  overrides: [
    {
      files: ['**/*.vue', '**/*.html'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    'color-no-invalid-hex': true,
  },
}

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'docs/*', '.venv/*', 'android/*', 'ios/*', 'admin-panel/*', '**/*.d.ts'],
  },
  {
    rules: {
      // Yakalanan ama kullanılmayan hatalar bilinçli: kullanıcı akışını
      // bozmamak için sessizce yutulan yan etkiler var.
      'no-unused-vars': ['warn', { caughtErrors: 'none', argsIgnorePattern: '^_' }],
    },
  },
]);

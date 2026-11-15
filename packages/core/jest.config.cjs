/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  // Çerçeve paketlerinin (react/vue/nextjs) ince sarmalayıcıları da buradan
  // sınanır; onların kendi jest kurulumu yok.
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }] },
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  clearMocks: true,
  // nextjs/proxy testi çekirdeği kaynaktan kullansın (dist'e bağımlı olmasın).
  moduleNameMapper: {
    '^@veribenim/core$': '<rootDir>/src/index.ts',
    '^react$': '<rootDir>/../react/node_modules/react',
    '^react/jsx-runtime$': '<rootDir>/../react/node_modules/react/jsx-runtime',
    '^react-dom/client$': '<rootDir>/../react/node_modules/react-dom/client',
    '^vue$': '<rootDir>/../vue/node_modules/vue',
  },
};

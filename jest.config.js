module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      '<rootDir>/node_modules/',
    ],
    coverageThreshold: {
      global: {
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  };
  
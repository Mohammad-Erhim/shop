export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  modulePathIgnorePatterns: ['<rootDir>/dist/'], // Ignore built files
  setupFiles: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

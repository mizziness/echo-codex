// Run Jest tests from a dedicated directory called `jests`
// This is to keep Jest from clashing with Mocha

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/jests/**/*.test.ts'], // 👈 Only run your Jest tests
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^vscode$': '<rootDir>/__mocks__/vscode.ts'
  }
};

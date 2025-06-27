// Run Jest tests from a dedicated directory called `jests`
// This is to keep Jest from clashing with Mocha

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ["**/jests/**/*.test.ts"],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(zustand)/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/\\.vscode-test/'],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
};

export default config;
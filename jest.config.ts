import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['apps', 'libs'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['dist', 'node_modules', 'coverage'],
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 20,
      statements: 20,
      functions: 20,
      branches: 20,
    },
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  projects: ['<rootDir>/**/jest.config.js'],
  coverageReporters: ['json-summary', 'lcov'],
};

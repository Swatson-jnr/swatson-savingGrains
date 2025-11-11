/**
 * @type {import('jest').Config}
 */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/test/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: ["lib/**/*.ts", "!lib/**/*.d.ts", "!lib/**/index.ts"],
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  // Run tests sequentially to avoid database conflicts
  maxWorkers: 1,
}

module.exports = config


export default {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/test/setup.ts"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["json", "text", "text-summary", "lcov"],
};

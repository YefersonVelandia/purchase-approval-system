module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.css$": "<rootDir>/src/__tests__/styleMock.js",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
};

// jestSetupFile.ts
if (typeof jest !== "undefined") {
  jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
  );
}

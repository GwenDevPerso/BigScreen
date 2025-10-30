module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest-setup.js', '@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@testing-library|expo(nent)?|@expo(nent)?/.*|expo-modules-core|@unimodules|unimodules|react-clone-referenced-element|react-navigation|@react-navigation|native-base)/)',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/mocks/fileMock.js',
  },
};

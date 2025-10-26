// Jest setup file
// This is where we can configure Jest matchers and global test utilities

// Optionally suppress console warnings during tests
// Uncomment if you want to suppress warnings globally
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
  useSegments: () => [],
  Link: 'Link',
}));

// Mock react-tv-space-navigation
jest.mock('react-tv-space-navigation', () => ({
  FocusableButton: 'FocusableButton',
  useTVTheme: () => ({}),
}));

// Mock hooks
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#0066CC',
}));

jest.mock('@/hooks/useScale', () => ({
  useScale: () => 1.0,
}));


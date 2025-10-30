// Jest setup file
// This is where we can configure Jest matchers and global test utilities

// Optionally suppress console warnings during tests
// Uncomment if you want to suppress warnings globally
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Short-circuit RN host component detection to avoid ESM issues in helpers
jest.mock('@testing-library/react-native/build/helpers/host-component-names', () => {
  const hostComponentNames = {
    text: 'Text',
    textInput: 'TextInput',
    image: 'Image',
    switch: 'Switch',
    scrollView: 'ScrollView',
    modal: 'Modal',
  };
  return {
    __esModule: true,
    getHostComponentNames: () => hostComponentNames,
    configureHostComponentNamesIfNeeded: () => undefined,
    isHostText: (el) => el?.type === hostComponentNames.text,
    isHostTextInput: (el) => el?.type === hostComponentNames.textInput,
    isHostImage: (el) => el?.type === hostComponentNames.image,
    isHostSwitch: (el) => el?.type === hostComponentNames.switch,
    isHostScrollView: (el) => el?.type === hostComponentNames.scrollView,
    isHostModal: (el) => el?.type === hostComponentNames.modal,
  };
});

// Mock Expo Router
jest.mock('expo-router', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  };
  return {
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSegments: () => [],
    Link: 'Link',
    __mockRouter: mockRouter,
  };
});

// Mock react-tv-space-navigation
jest.mock('react-tv-space-navigation', () => {
  const React = require('react');
  return {
    FocusableButton: 'FocusableButton',
    useTVTheme: () => ({}),
    SpatialNavigationFocusableView: ({ children, onSelect }) =>
      React.createElement('View', { testID: 'snfv', onPress: onSelect }, typeof children === 'function' ? children({ isFocused: false }) : children),
  };
});

// Mock hooks
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#0066CC',
}));

jest.mock('@/hooks/useScale', () => ({
  useScale: () => 1.0,
}));

// Mock media context hook used by components
jest.mock('@/contexts/MediaContext', () => {
  return {
    useMedia: jest.fn(() => ({
      selectedStream: { id: '1', name: 'mock' },
      isStreamPlaying: () => false,
      playPauseStream: jest.fn(),
    })),
  };
});


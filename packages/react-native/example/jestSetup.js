import mock from '@kubric/notifee-react-native/jest-mock';

// To disable warning  Animated: `useNativeDriver` is not supported because the native animated module is missing.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@kubric/notifee-react-native', () => mock);

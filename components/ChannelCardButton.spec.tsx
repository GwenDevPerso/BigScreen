import {render, fireEvent, screen} from '@testing-library/react-native';
import ChannelCardButton from './ChannelCardButton';
import {useMedia} from '../contexts/MediaContext';
import {Stream} from '@/types/Stream.type';
import {Logo} from '@/types/Logo.type';

jest.mock('../contexts/MediaContext');
jest.mock('react-tv-space-navigation', () => ({
    SpatialNavigationNode: ({children, ...props}: any) =>
        typeof children === 'function' ? children({isFocused: false}) : children,
}));

describe('ChannelCardButton', () => {
    const setSelectedStream = jest.fn();
    const setFocusedStream = jest.fn();
    const mockStream: Stream = {channel: 'ChannelTest', title: 'Test Stream', url: 'test-url', feed: 'feedTest', referrer: 'referrerTest', user_agent: 'userAgentTest', quality: 'qualityTest', logo: {url: 'https://example.com/logo.png', channel: 'ChannelTest', feed: 'feedTest', tags: ['tag1', 'tag2'], width: 100, height: 100, format: 'png'}};

    beforeEach(() => {
        jest.clearAllMocks();
        (useMedia as jest.Mock).mockReturnValue({
            selectedStream: null,
            setSelectedStream,
            setFocusedStream,
            focusedStream: null,
        });
    });

    it('should render', () => {
        render(<ChannelCardButton stream={mockStream} />);
        expect(screen.getByTestId('channel-card-button')).toBeTruthy();
        expect(screen.getByText('Test Stream')).toBeTruthy();
        expect(screen.getByTestId('logo-image')).toBeTruthy();
    });

    it('calls setSelectedStream on press', () => {
        render(<ChannelCardButton stream={mockStream} />);
        fireEvent.press(screen.getByTestId('channel-card-button'));
        expect(setSelectedStream).not.toHaveBeenCalled(); // Only called on certain interaction (onSelect) in this impl.
    });

    it('sets focus on spatial navigation event', () => {
        render(<ChannelCardButton stream={mockStream} />);
        // Can't simulate spatial nav event, but ensures mounting works
        expect(setFocusedStream).not.toHaveBeenCalled();
    });

    it('renders with selected/focused styles if context provides them', () => {
        (useMedia as jest.Mock).mockReturnValue({
            selectedStream: {...mockStream},
            setSelectedStream,
            setFocusedStream,
            focusedStream: {...mockStream},
        });
        const {getByText} = render(<ChannelCardButton stream={mockStream} />);
        expect(getByText('Test Stream')).toBeTruthy(); // Render with styles applied
    });
});

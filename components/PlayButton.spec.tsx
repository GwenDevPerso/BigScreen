import {fireEvent, render, screen} from '@testing-library/react-native';
import PlayButton from './PlayButton';

jest.mock('@/contexts/MediaContext');

describe('PlayButton', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        render(<PlayButton type="regular" />);
        expect(screen.getByTestId('play-button')).toBeTruthy();
    });

    it('pressing calls playPauseStream with selectedStream (regular)', () => {
        const {useMedia} = require('@/contexts/MediaContext');
        const selectedStream = {id: '42'};
        const playPauseStream = jest.fn();
        (useMedia as jest.Mock).mockReturnValue({
            selectedStream,
            isStreamPlaying: () => false,
            playPauseStream,
        });

        render(<PlayButton type="regular" />);
        fireEvent.press(screen.getByTestId('snfv'));
        expect(playPauseStream).toHaveBeenCalledWith(selectedStream);
    });

    it('pressing navigates to /player with stream param (navigation)', () => {
        const {useMedia} = require('@/contexts/MediaContext');
        const selectedStream = {id: '99', name: 'mock'};
        const playPauseStream = jest.fn();
        (useMedia as jest.Mock).mockReturnValue({
            selectedStream,
            isStreamPlaying: () => false,
            playPauseStream,
        });

        const {useRouter} = require('expo-router');
        const router = useRouter();
        router.push.mockClear();

        render(<PlayButton type="navigation" />);
        fireEvent.press(screen.getByTestId('snfv'));

        expect(router.push).toHaveBeenCalledWith({
            pathname: '/player',
            params: {stream: JSON.stringify(selectedStream)},
        });

        expect(playPauseStream).toHaveBeenCalledWith(selectedStream);
    });
});
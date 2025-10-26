import {useCallback, useEffect, useRef} from 'react';
import {useMedia} from '../contexts/MediaContext';
import {Stream} from '../types/Stream.type';

export const useTVMedia = (streams: Stream[]) => {
    const { playStream, pauseStream, isStreamPlaying, selectedStream } = useMedia();
    const streamsRef = useRef(streams);

    useEffect(() => {
        streamsRef.current = streams;
    }, [streams]);

    const handleTVPlayPause = useCallback(() => {
        if (selectedStream) {
            if (isStreamPlaying(selectedStream)) {
                pauseStream();
            } else {
                playStream(selectedStream);
            }
        }
    }, [selectedStream, isStreamPlaying, playStream, pauseStream]);

    return {
        handleTVPlayPause,
        selectedStream,
    };
};

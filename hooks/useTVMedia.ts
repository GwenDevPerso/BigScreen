import {useCallback, useEffect, useRef} from 'react';
import {useMedia} from '../contexts/MediaContext';
import {useTVHandler} from '../contexts/TVHandlerContext';
import {Stream} from '../types/Stream.type';

export const useTVMedia = (streams: Stream[]) => {
    const { focusedItem } = useTVHandler();
    const { playStream, pauseStream, isStreamPlaying } = useMedia();
    const streamsRef = useRef(streams);

    // Keep streams ref up to date
    useEffect(() => {
        streamsRef.current = streams;
    }, [streams]);

    const handleTVPlayPause = useCallback(() => {
        const focusedStream = streamsRef.current[focusedItem];
        if (focusedStream) {
            if (isStreamPlaying(focusedStream)) {
                pauseStream();
            } else {
                playStream(focusedStream);
            }
        }
    }, [focusedItem, isStreamPlaying, playStream, pauseStream]);

    // Memoize the focused stream to avoid unnecessary re-renders
    const focusedStream = streams[focusedItem] || null;
    const isFocusedStreamPlaying = focusedStream ? isStreamPlaying(focusedStream) : false;

    return {
        handleTVPlayPause,
        focusedStream,
        isFocusedStreamPlaying,
    };
};

// src/contexts/MediaContext.tsx
import {createContext, useContext, useState, useCallback, ReactNode} from 'react';
import {Stream} from '../types/Stream.type';

type MediaContextType = {

    selectedStream: Stream | null;
    setSelectedStream: (stream: Stream | null) => void;

    focusedStream: Stream | null;
    setFocusedStream: (stream: Stream | null) => void;

    // Media control functions
    playPauseStream: (stream: Stream | null) => void;

    // Utility functions
    isStreamPlaying: (stream: Stream | null) => boolean;
};

const MediaContext = createContext<MediaContextType>({
    selectedStream: null,
    setSelectedStream: () => { },
    focusedStream: null,
    setFocusedStream: () => { },
    playPauseStream: () => { },
    isStreamPlaying: () => false,
});

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};

export default function MediaProvider({children}: {children: ReactNode;}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
    const [focusedStream, setFocusedStream] = useState<Stream | null>(null);

    const playPauseStream = useCallback((stream: Stream | null) => {
        if (!stream) {
            setIsPlaying(false);
            return;
        }
        if (isPlaying && selectedStream?.url === stream.url) {
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
        }
    }, [isPlaying, selectedStream]);

    const isStreamPlaying = useCallback((stream: Stream | null) => {
        return isPlaying && selectedStream?.url === stream?.url;
    }, [isPlaying, selectedStream]);

    const value: MediaContextType = {
        selectedStream,
        setSelectedStream,
        focusedStream,
        setFocusedStream,
        playPauseStream,
        isStreamPlaying,
    };

    return (
        <MediaContext.Provider value={value}>
            {children}
        </MediaContext.Provider>
    );
}
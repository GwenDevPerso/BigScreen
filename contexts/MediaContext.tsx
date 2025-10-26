// src/contexts/MediaContext.tsx
import {createContext, useContext, useState, useCallback, ReactNode} from 'react';
import {Stream} from '../types/Stream.type';

type MediaContextType = {

    selectedStream: Stream | null;
    setSelectedStream: (stream: Stream | null) => void;

    // Media control functions
    playStream: (stream: Stream) => void;
    pauseStream: () => void;

    // Utility functions
    isStreamPlaying: (stream: Stream | null) => boolean;
};

const MediaContext = createContext<MediaContextType>({
    selectedStream: null,
    setSelectedStream: () => { },
    playStream: () => { },
    pauseStream: () => { },
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

    const playStream = useCallback((stream: Stream) => {
        // Stop any currently playing stream
        if (isPlaying && selectedStream) {
            console.log('Stopping current stream:', selectedStream.title);
        }

        setIsPlaying(true);

    }, [isPlaying, selectedStream]);

    const pauseStream = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            console.log('Pausing stream:', selectedStream?.title);
        }
    }, [isPlaying, selectedStream]);

    const isStreamPlaying = useCallback((stream: Stream | null) => {
        return isPlaying && selectedStream?.url === stream?.url;
    }, [isPlaying, selectedStream]);

    const value: MediaContextType = {
        selectedStream,
        setSelectedStream,
        playStream,
        pauseStream,
        isStreamPlaying,
    };

    return (
        <MediaContext.Provider value={value}>
            {children}
        </MediaContext.Provider>
    );
}
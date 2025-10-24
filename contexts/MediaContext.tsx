// src/contexts/MediaContext.tsx
import {createContext, useContext, useState, useCallback, ReactNode} from 'react';
import {Stream} from '../types/Stream.type';

type MediaContextType = {
    // Current playing state
    isPlaying: boolean;
    currentlyPlayingStream: Stream | null;

    // Media control functions
    playStream: (stream: Stream) => void;
    pauseStream: () => void;
    stopStream: () => void;
    togglePlayPause: () => void;

    // Utility functions
    isStreamPlaying: (stream: Stream) => boolean;
};

const MediaContext = createContext<MediaContextType>({
    isPlaying: false,
    currentlyPlayingStream: null,
    playStream: () => { },
    pauseStream: () => { },
    stopStream: () => { },
    togglePlayPause: () => { },
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
    const [currentlyPlayingStream, setCurrentlyPlayingStream] = useState<Stream | null>(null);

    const playStream = useCallback((stream: Stream) => {
        // Stop any currently playing stream
        if (isPlaying && currentlyPlayingStream) {
            console.log('Stopping current stream:', currentlyPlayingStream.title);
        }

        // Start the new stream
        setIsPlaying(true);
        setCurrentlyPlayingStream(stream);
        console.log('Starting stream:', stream.title);

        // Here you would integrate with your actual media player
        // e.g., Video component, audio player, etc.
    }, [isPlaying, currentlyPlayingStream]);

    const pauseStream = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
            console.log('Pausing stream:', currentlyPlayingStream?.title);
        }
    }, [isPlaying, currentlyPlayingStream]);

    const stopStream = useCallback(() => {
        setIsPlaying(false);
        setCurrentlyPlayingStream(null);
        console.log('Stopped all media');
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pauseStream();
        } else if (currentlyPlayingStream) {
            playStream(currentlyPlayingStream);
        }
    }, [isPlaying, currentlyPlayingStream, playStream, pauseStream]);

    const isStreamPlaying = useCallback((stream: Stream) => {
        return isPlaying && currentlyPlayingStream?.title === stream.title;
    }, [isPlaying, currentlyPlayingStream]);

    const value: MediaContextType = {
        isPlaying,
        currentlyPlayingStream,
        playStream,
        pauseStream,
        stopStream,
        togglePlayPause,
        isStreamPlaying,
    };

    return (
        <MediaContext.Provider value={value}>
            {children}
        </MediaContext.Provider>
    );
}
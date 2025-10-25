import {createContext, useEffect, useState, useContext, useCallback} from 'react';
import {TVEventHandler, BackHandler} from 'react-native';

type TVHandlerContextType = {
    focusedItem: number;
    setMaxItems: (max: number) => void;
    isPlayButtonFocused: boolean;
    setOnSelect: (callback: (item: number) => void) => void;
    setOnPlayPause: (callback: () => void) => void;
};

const TVHandlerContext = createContext<TVHandlerContextType>({
    focusedItem: 0,
    setMaxItems: () => { },
    isPlayButtonFocused: false,
    setOnSelect: () => { },
    setOnPlayPause: () => { },


});

export const useTVHandler = () => {
    const context = useContext(TVHandlerContext);
    if (!context) {
        throw new Error('useTVHandler must be used within a TVHandlerProvider');
    }
    return context;
};

export default function TVHandlerProvider({children}: {children: React.ReactNode;}) {
    const [focusedItem, setFocusedItem] = useState(0);
    const [maxItems, setMaxItems] = useState(0);
    const [isPlayButtonFocused, setIsPlayButtonFocused] = useState(false);
    const [onSelect, setOnSelect] = useState<((item: number) => void) | undefined>();
    const [onPlayPause, setOnPlayPause] = useState<(() => void) | undefined>();

    const navigateRight = useCallback(() => {
        if (isPlayButtonFocused) {
            // Si le bouton Play est focus, aller au premier stream
            setIsPlayButtonFocused(false);
            setFocusedItem(0);
        } else {
            // Navigation normale entre les streams
            setFocusedItem(prev => Math.min(prev + 1, maxItems - 1));
        }
    }, [maxItems, isPlayButtonFocused]);

    const navigateLeft = useCallback(() => {
        if (isPlayButtonFocused) {
            // Si le bouton Play est focus, aller au dernier stream
            setIsPlayButtonFocused(false);
            setFocusedItem(maxItems - 1);
        } else if (focusedItem === 0) {
            // Si on est sur le premier stream, aller au bouton Play
            setIsPlayButtonFocused(true);
        } else {
            // Navigation normale entre les streams
            setFocusedItem(prev => Math.max(prev - 1, 0));
        }
    }, [maxItems, isPlayButtonFocused, focusedItem]);

    const navigateUp = useCallback(() => {
        // Navigation vers le bouton Play
        setIsPlayButtonFocused(true);
    }, []);

    const navigateDown = useCallback(() => {
        // Navigation vers les streams (premier stream)
        setIsPlayButtonFocused(false);
        setFocusedItem(0);
    }, []);

    const handleSelect = useCallback(() => {
        console.log('Select pressed on item:', focusedItem);
        if (onSelect) {
            onSelect(focusedItem);
        }
    }, [focusedItem, onSelect]);

    const handlePlayPause = useCallback(() => {
        console.log('Play/Pause pressed');
        if (onPlayPause) {
            onPlayPause();
        }
    }, [onPlayPause]);

    useEffect(() => {
        // Add TV event listener using the correct API
        const subscription = TVEventHandler.addListener((evt) => {
            if (evt && evt.eventType === 'right') {
                navigateRight();
            } else if (evt && evt.eventType === 'left') {
                navigateLeft();
            } else if (evt && evt.eventType === 'up') {
                navigateUp();
            } else if (evt && evt.eventType === 'down') {
                navigateDown();
            } else if (evt && evt.eventType === 'select') {
                handleSelect();
            } else if (evt && evt.eventType === 'playPause') {
                handlePlayPause();
            }
        });

        // Handle back navigation (Android TV back button, Apple TV menu button)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            console.log('Back button pressed');
            return true; // Prevent default behavior
        });

        // Cleanup
        return () => {
            subscription?.remove();
            backHandler.remove();
        };
    }, [navigateRight, navigateLeft, navigateUp, navigateDown, handleSelect, handlePlayPause]);

    const value: TVHandlerContextType = {
        focusedItem,
        setMaxItems,
        isPlayButtonFocused,
        setOnSelect,
        setOnPlayPause,
    };

    return (
        <TVHandlerContext.Provider value={value}>
            {children}
        </TVHandlerContext.Provider>
    );
}
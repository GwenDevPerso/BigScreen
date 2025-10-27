import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useRouter, useLocalSearchParams, usePathname} from 'expo-router';
import MediaPlayer from '@/components/MediaPlayer';
import {SpatialNavigationNode, SpatialNavigationRoot, SpatialNavigationView} from 'react-tv-space-navigation';
import PlayButton from '@/components/PlayButton';
import {useMedia} from '@/contexts/MediaContext';

export default function PlayerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const route = usePathname();
    const {playPauseStream} = useMedia();

    const streamData = params.stream ? JSON.parse(params.stream as string) : null;

    const handleBackPress = () => {
        router.back();
        playPauseStream(null);
    };

    if (!streamData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No stream data available</Text>
                <Text style={styles.debugText}>Params: {JSON.stringify(params)}</Text>
                <SpatialNavigationNode
                    isFocusable
                    onSelect={handleBackPress}
                >
                    {({isFocused: spatialFocused}) => (
                        <Pressable
                            style={[
                                styles.backButton,
                                spatialFocused && styles.focused
                            ]}
                        >
                            <Text style={styles.backButtonText}>Go Back</Text>
                        </Pressable>
                    )}
                </SpatialNavigationNode>
            </View>
        );
    }

    return (
        <SpatialNavigationRoot isActive={route === '/player'}>
            <SpatialNavigationView direction="vertical" style={styles.container}>
                <MediaPlayer stream={streamData} />
                <SpatialNavigationView direction='horizontal' style={styles.buttonsContainer}>
                    <SpatialNavigationNode
                        isFocusable
                        onSelect={handleBackPress}
                    >
                        {({isFocused: spatialFocused}) => (
                            <Pressable
                                style={[
                                    styles.backButton,
                                    spatialFocused && styles.focused
                                ]}
                            >
                                <Text style={styles.backButtonText}>← Back to Home</Text>
                            </Pressable>
                        )}
                    </SpatialNavigationNode>
                    <PlayButton type="regular" />
                </SpatialNavigationView>
            </SpatialNavigationView>
        </SpatialNavigationRoot>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    errorText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
        fontFamily: 'Montserrat',
    },
    debugText: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Montserrat',
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 20,
    },
    backButton: {
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat',
        fontWeight: '600',
    },
    focused: {
        backgroundColor: '#00A0DF',
    }
});

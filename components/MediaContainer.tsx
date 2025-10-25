import React from "react";
import {View, StyleSheet, Text, Image, Pressable} from "react-native";
import {Stream} from "../types/Stream.type";
import {useMedia} from "../contexts/MediaContext";
import {useTVHandler} from "../contexts/TVHandlerContext";
import {useRouter} from "expo-router";
import {SpatialNavigationNode} from 'react-tv-space-navigation';


export default function MediaContainer({stream}: {stream: Stream;}) {
    const {isStreamPlaying} = useMedia();
    const {isPlayButtonFocused} = useTVHandler();
    const router = useRouter();

    const isThisStreamPlaying = isStreamPlaying(stream);

    if (!stream) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No stream selected</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.channel}>{stream.channel}</Text>
                <Text style={styles.title}>{stream.title}</Text>

                <SpatialNavigationNode
                    isFocusable
                >
                    {({isFocused: spatialFocused}) => (
                        <Pressable
                            style={[
                                styles.playButton,
                                (isPlayButtonFocused || spatialFocused) && styles.playButtonFocused
                            ]}
                            onPress={() => {
                                console.log('Play button pressed, stream:', stream.title);
                                console.log('Navigating to /player with stream:', JSON.stringify(stream));
                                router.push({
                                    pathname: '/player',
                                    params: {
                                        stream: JSON.stringify(stream)
                                    }
                                });
                            }}
                            hasTVPreferredFocus={isPlayButtonFocused}
                            tvParallaxProperties={{
                                enabled: false,
                            }}
                        >
                            <Image
                                source={isThisStreamPlaying
                                    ? require("@/assets/images/pause.png")
                                    : require("@/assets/images/play.png")
                                }
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </Pressable>
                    )}
                </SpatialNavigationNode>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        minHeight: '60%',
        minWidth: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 24,
    },
    channel: {
        fontSize: 44,
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Montserrat_600SemiBold',
    },
    title: {
        fontSize: 64,
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Montserrat_600SemiBold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Montserrat_700Bold',
    },
    playButton: {
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 48,
        borderRadius: 24,
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 8,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0,
        overflow: 'hidden',
    },
    playButtonFocused: {
        backgroundColor: '#00A0DF',
        transform: [{scale: 1.05}],
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0,
        overflow: 'hidden',
    },
    icon: {
        width: 24,
        height: 24,
    },
});
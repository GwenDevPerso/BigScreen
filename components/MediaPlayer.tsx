import React, {useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import Video from "react-native-video";
import {Stream} from "../types/Stream.type";

export default function MediaPlayer({stream}: {stream: Stream;}) {
    const [error, setError] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{stream?.title}</Text>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Impossible de lire le stream</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                </View>
            ) : (
                <Video
                    source={{
                        uri: stream.url,
                    }}
                    style={styles.video}
                    controls
                    resizeMode="contain"
                    onError={(error) => {
                        console.log("Bad format video error:", {
                            url: stream.url,
                            referrer: stream.referrer,
                            user_agent: stream.user_agent,
                            quality: stream.quality,
                        });
                        setError(`Erreur de lecture: ${error.error.errorCode || 'Unknown error'}`);
                    }}
                    onLoad={() => {
                        console.log("Video loaded successfully for:", {
                            url: stream.url,
                            referrer: stream.referrer,
                            user_agent: stream.user_agent,
                            quality: stream.quality,
                        });
                        setError(null);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Montserrat',
    },
    channel: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Montserrat',
        fontWeight: '600',
    },
    url: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    video: {
        width: '100%',
        height: '70%',
        marginTop: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    errorMessage: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    errorActions: {
        flexDirection: 'row',
        gap: 20,
    },
    errorButton: {
        backgroundColor: '#00A0DF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Montserrat',
    },
});
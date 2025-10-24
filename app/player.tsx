import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import MediaPlayer from '@/components/MediaPlayer';

export default function PlayerScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get stream data from params
    const streamData = params.stream ? JSON.parse(params.stream as string) : null;

    const handleBackPress = () => {
        router.back();
    };

    console.log('PlayerScreen - params:', params);
    console.log('PlayerScreen - streamData:', streamData);

    if (!streamData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No stream data available</Text>
                <Text style={styles.debugText}>Params: {JSON.stringify(params)}</Text>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MediaPlayer stream={streamData} />
            <Pressable onPress={handleBackPress} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back to Home</Text>
            </Pressable>
        </View>
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
        fontFamily: 'Montserrat_400Regular',
    },
    debugText: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Montserrat_400Regular',
    },
    backButton: {
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
    },
});

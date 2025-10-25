import React from "react";
import {View, StyleSheet, Text} from "react-native";
import Video from "react-native-video";
import {Stream} from "../types/Stream.type";

export default function MediaPlayer({stream}: {stream: Stream;}) {
    console.log('MediaPlayer rendered with stream:', JSON.stringify(stream, null, 2));


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{stream?.title}</Text>

            <Video
                source={{
                    uri: stream.url,
                    headers: stream.referrer || stream.user_agent ? {
                        ...(stream.referrer && {'Referer': stream.referrer}),
                        ...(stream.user_agent && {'User-Agent': stream.user_agent}),
                    } : undefined
                }}
                style={styles.video}
                controls
                resizeMode="contain"
                onError={(error) => {
                    console.error('Video error:', error);
                    console.error('Stream URL:', stream.url);
                    console.error('Stream data:', JSON.stringify(stream, null, 2));
                }}
                onLoad={() => {
                    console.log('Video loaded successfully for:', stream.title);
                }}
            />
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
        fontFamily: 'Montserrat_700Bold',
    },
    channel: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Montserrat_600SemiBold',
    },
    url: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Montserrat_400Regular',
    },
    video: {
        width: '100%',
        height: '70%',
        marginTop: 20,
    },
});   
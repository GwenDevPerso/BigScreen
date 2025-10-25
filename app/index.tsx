import {StyleSheet, View, Text, ScrollView, Alert, Image, ImageBackground} from "react-native";
import ChannelCardButton from "@/components/ChannelCardButton";
import {useEffect, useState} from "react";
import {useTVHandler} from "@/contexts/TVHandlerContext";
import {useMedia} from "@/contexts/MediaContext";
import MediaContainer from "@/components/MediaContainer";

import {Stream} from "@/types/Stream.type";
import {mapStreams} from "@/utils/stream.utils";

export default function HomeScreen() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [loading, setLoading] = useState(true);
    const {focusedItem, setMaxItems, setOnSelect, isPlayButtonFocused, setOnPlayPause} = useTVHandler();
    const {setSelectedStream} = useMedia();

    useEffect(() => {
        const fetchData = async () => {
            const streamsData = await getStreams();
            const logosData = await getLogos();
            const mappedStreams = mapStreams(streamsData, logosData);
            console.log(JSON.stringify(mappedStreams, null, 2));
            setStreams(mappedStreams);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Configure TV handler for this screen
        setMaxItems(streams.length);

        setOnSelect((item: number) => {
            const selectedStream = streams[item];
            if (selectedStream) {
                console.log('Selected stream:', selectedStream.title);
            }
        });

        return () => {
            setOnSelect(() => { });
        };
    }, [streams.length]);

    // Update selectedStream when focusedItem changes (navigation)
    useEffect(() => {
        if (streams.length > 0 && focusedItem < streams.length) {
            const currentStream = streams[focusedItem];
            if (currentStream) {
                setSelectedStream(currentStream);
                console.log('Navigation: Selected stream:', JSON.stringify(currentStream, null, 2));
            }
        }
    }, [focusedItem, streams, setSelectedStream]);

    // Configure TV handler for play/pause - show video info when play button is pressed
    useEffect(() => {
        const handlePlayPause = () => {
            const currentStream = streams[focusedItem];
            if (currentStream) {
                console.log('TV Play/Pause pressed, playing:', currentStream.title);
            }
        };

        setOnPlayPause(handlePlayPause);

        return () => {
            setOnPlayPause(() => { });
        };
    }, [streams, focusedItem, setOnPlayPause]);

    const getStreams = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://iptv-org.github.io/api/streams.json');
            const streamsData = await response.json();

            // Take first 20 channels for demo
            const limitedStreams = streamsData.filter((stream: any) => stream.channel !== null).slice(0, 20).map((stream: any) => ({
                channel: stream.channel,
                feed: stream.feed,
                title: stream.title,
                url: stream.url,
                referrer: stream.referrer,
                user_agent: stream.user_agent,
                quality: stream.quality,
                logo: stream.logo,
            }));

            return limitedStreams;
        } catch (error) {
            console.error('Error fetching streams:', error);
            Alert.alert('Error', 'Failed to load streams', [{text: 'OK', onPress: () => { }}]);
        } finally {
            setLoading(false);
        }
    };

    const getLogos = async () => {
        try {
            const response = await fetch('https://iptv-org.github.io/api/logos.json');
            const logos = await response.json();
            return logos;
        } catch (error) {
            console.error('Error fetching logos:', error);
            return null;
        }
    };

    if (loading) {
        return (
            <ImageBackground
                source={require("@/assets/images/background.jpg")}
                style={styles.container}
                resizeMode="stretch"
                imageStyle={styles.backgroundImage}
            >
                <Text style={styles.loadingText}>Loading streams...</Text>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require("@/assets/images/background.jpg")}
            style={styles.container}
            resizeMode="stretch"
            imageStyle={styles.backgroundImage}
        >
            <View style={styles.header}>
                <Image
                    source={require("@/assets/images/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                    width={200}
                    height={80}
                />
            </View>
            <MediaContainer stream={streams[focusedItem]} />
            <ScrollView
                style={styles.scrollView}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {streams.map((stream, index) => (
                    <ChannelCardButton
                        key={stream.title + index}
                        title={stream.title}
                        logo={stream.logo}
                        stream={stream}
                        onPress={() => {
                            console.log(`Selected: ${stream.title}`);
                        }}
                        isFocused={focusedItem === index && !isPlayButtonFocused}
                        hasTVPreferredFocus={focusedItem === index && !isPlayButtonFocused}
                        focusId={`channel-${index}`}
                    />
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 60,
        paddingBottom: 0,
        justifyContent: 'space-between',
    },
    backgroundImage: {
        flex: 1,
    },
    header: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
    },
    logo: {
        width: 200,
        height: 80,
    },

    /**
     * Scroll view
     */
    scrollView: {
        height: 168,
        marginBottom: 0,
    },
    loadingText: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginTop: 100,
        fontFamily: 'Montserrat_400Regular',
    },
});

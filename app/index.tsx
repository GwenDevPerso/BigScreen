import {StyleSheet, View, Text, Alert, Image, ImageBackground, ScrollView, Pressable} from "react-native";
import ChannelCardButton from "@/components/ChannelCardButton";
import {useEffect, useState} from "react";
import {useMedia} from "@/contexts/MediaContext";
import {Stream} from "@/types/Stream.type";
import {mapStreams} from "@/utils/stream.utils";
import {SpatialNavigationNode, SpatialNavigationRoot, SpatialNavigationScrollView, SpatialNavigationView} from "react-tv-space-navigation";
import {router, usePathname} from "expo-router";

export default function HomeScreen() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const {selectedStream, setSelectedStream, isStreamPlaying} = useMedia();
  const route = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const streamsData = await getStreams();
      const logosData = await getLogos();
      const mappedStreams = mapStreams(streamsData, logosData);
      setStreams(mappedStreams);
      setSelectedStream(mappedStreams[0]);
    };
    fetchData();
  }, [setSelectedStream]);

  const getStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://iptv-org.github.io/api/streams.json');
      const streamsData = await response.json();

      // Take first 20 channels for demo
      const limitedStreams = streamsData.filter((stream: any) => stream.channel !== null && stream.quality !== null).slice(0, 30).map((stream: any) => ({
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
    <SpatialNavigationRoot isActive={route === '/'}>
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
        <SpatialNavigationView direction="vertical" style={styles.content}>
          {/* Info container */}
          <View style={styles.infoContainer}>
            <Text style={styles.channel}>{selectedStream?.channel}</Text>
            <Text style={styles.title}>{selectedStream?.title}</Text>

            <SpatialNavigationNode
              isFocusable
              onSelect={() => {
                router.push({
                  pathname: '/player',
                  params: {
                    stream: JSON.stringify(selectedStream)
                  }
                });
              }}
            >
              {({isFocused}) => (
                <Pressable
                  style={[
                    styles.playButton,
                    isFocused && styles.playButtonFocused
                  ]}
                  tvParallaxProperties={{
                    enabled: false,
                  }}
                >
                  <Image
                    source={isStreamPlaying(selectedStream)
                      ? require("@/assets/images/pause.png")
                      : require("@/assets/images/play.png")
                    }
                    resizeMode="contain"
                    width={24}
                    height={24}
                  />
                </Pressable>
              )}
            </SpatialNavigationNode>
          </View>
          {/* Channels */}
          <SpatialNavigationScrollView horizontal>
            <SpatialNavigationView direction="horizontal">
              {streams.map((stream, index) => (
                <ChannelCardButton
                  key={stream.title + index}
                  logo={stream.logo}
                  stream={stream}
                />
              ))}
            </SpatialNavigationView>
          </SpatialNavigationScrollView>
        </SpatialNavigationView>
      </ImageBackground>
    </SpatialNavigationRoot>
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

  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
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
    fontFamily: 'Montserrat',
  },

  /**
   * Info container
   */
  infoContainer: {
    height: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 24,
  },
  channel: {
    fontSize: 44,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  title: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },

  /**
   * Play button
   */
  playButton: {
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 48,
    borderRadius: 8,
  },
  playButtonFocused: {
    backgroundColor: '#00A0DF',
  },
});

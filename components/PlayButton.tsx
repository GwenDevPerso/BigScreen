import {useMedia} from "@/contexts/MediaContext";
import {SpatialNavigationFocusableView} from "react-tv-space-navigation";
import {useRouter} from "expo-router";
import {Pressable, StyleSheet, Image} from "react-native";

export default function PlayButton({type}: {type: 'regular' | 'navigation';}) {
    const {selectedStream, isStreamPlaying, playPauseStream} = useMedia();
    const router = useRouter();

    return (
        <SpatialNavigationFocusableView onSelect={() => {
            if (type === 'navigation') {
                router.push({
                    pathname: '/player',
                    params: {
                        stream: JSON.stringify(selectedStream)
                    }
                });
            }
            playPauseStream(selectedStream);
        }}>
            {({isFocused}: {isFocused: boolean;}) => (
                <Pressable
                    style={[
                        styles.playButton,
                        isFocused && styles.playButtonFocused
                    ]}
                    tvParallaxProperties={{
                        enabled: false,
                    }}
                    testID="play-button"
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
        </SpatialNavigationFocusableView>
    );
}

const styles = StyleSheet.create({
    playButton: {
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        width: 80,
        height: 48,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    playButtonFocused: {
        backgroundColor: '#00A0DF',
    },
});
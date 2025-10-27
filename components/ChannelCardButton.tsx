import {Pressable, Text, StyleSheet, Image, View} from 'react-native';
import {Logo} from '../types/Logo.type';
import {SpatialNavigationNode} from 'react-tv-space-navigation';
import {useMedia} from '../contexts/MediaContext';
import {Stream} from '../types/Stream.type';

interface ChannelCardButtonProps {
    logo?: Logo;
    stream: Stream;
}

export default function ChannelCardButton({
    logo,
    stream,
}: ChannelCardButtonProps) {
    const {selectedStream, setSelectedStream, setFocusedStream, focusedStream} = useMedia();

    return (
        <SpatialNavigationNode isFocusable={true}
            onFocus={() => {
                setFocusedStream(stream);
                console.log('Focus on ChannelCardButton', stream.title);
            }}
            onSelect={() => {
                if (stream) {
                    setSelectedStream(stream);
                }
            }}>
            {({isFocused}) => {
                return (
                    <Pressable
                        style={[
                            styles.container,
                            selectedStream?.url === stream?.url && styles.selectedContainer,
                            isFocused && styles.focusedContainer,
                        ]}
                        onPress={() => {
                            if (focusedStream) {
                                setSelectedStream(focusedStream);
                            }
                        }}
                    >
                        <View style={styles.content}>
                            {logo && (
                                <Image
                                    source={{uri: logo.url}}
                                    style={[
                                        styles.logo,
                                        isFocused && styles.focusedLogo
                                    ]}
                                    resizeMode="contain"
                                    onError={() => {
                                        console.log('Failed to load logo:', logo);
                                    }}
                                />
                            )}
                            <Text style={[
                                styles.title,
                                isFocused && styles.focusedTitle
                            ]}>
                                {stream?.title}
                            </Text>
                        </View>
                    </Pressable>
                );
            }}
        </SpatialNavigationNode>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "#364250",
        opacity: 0.85,
        borderRadius: 8,
        marginRight: 10,
        width: 168,
        height: 168,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0, // Pour Android
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    focusedTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Montserrat',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    focusedLogo: {
        width: 65,
        height: 65,
    },
    focusedContainer: {
        backgroundColor: '#00A0DF',
        opacity: 1,
        borderRadius: 8,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0, // Pour Android
        overflow: 'hidden',
    },
    selectedContainer: {
        backgroundColor: "#465565",
        opacity: 1,
        borderBottomWidth: 8,
        borderBottomColor: '#7F8FA2',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0, // Pour Android
        overflow: 'hidden',
    },

});
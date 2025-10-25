import {Pressable, Text, StyleSheet, Image, View} from 'react-native';
import {Logo} from '../types/Logo.type';
import {SpatialNavigationNode} from 'react-tv-space-navigation';
import {useMedia} from '../contexts/MediaContext';
import {Stream} from '../types/Stream.type';

interface ChannelCardButtonProps {
    title: string;
    logo?: Logo;
    onPress: () => void;
    isFocused?: boolean;
    hasTVPreferredFocus?: boolean;
    focusId?: string;
    stream?: Stream;
}

export default function ChannelCardButton({
    title,
    logo,
    onPress,
    isFocused = false,
    hasTVPreferredFocus = false,
    focusId,
    stream
}: ChannelCardButtonProps) {
    const {selectedStream} = useMedia();

    // Check if this stream is selected but not focused
    const isSelected = stream && selectedStream && stream.url === selectedStream.url;
    const isSelectedButNotFocused = isSelected && !isFocused;

    return (
        <SpatialNavigationNode
            isFocusable
        >
            {({isFocused: spatialFocused}) => (
                <Pressable
                    style={[
                        styles.container,
                        (isFocused || spatialFocused) && styles.focusedContainer,
                        isSelectedButNotFocused && styles.selectedContainer
                    ]}
                    onPress={onPress}
                    hasTVPreferredFocus={hasTVPreferredFocus}
                    tvParallaxProperties={{
                        enabled: false,
                    }}
                >
                    <View style={styles.content}>
                        {logo && (
                            <Image
                                source={{uri: logo.url}}
                                style={[
                                    styles.logo,
                                    (isFocused || spatialFocused) && styles.focusedLogo
                                ]}
                                resizeMode="contain"
                                onError={() => {
                                    console.log('Failed to load logo:', logo);
                                }}
                            />
                        )}
                        <Text style={[
                            styles.title,
                            (isFocused || spatialFocused) && styles.focusedTitle
                        ]}>
                            {title}
                        </Text>
                    </View>
                </Pressable>
            )}
        </SpatialNavigationNode>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: "#364250",
        opacity: 0.85,
        borderRadius: 8,
        marginHorizontal: 8,
        width: 168,
        height: 168,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
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
        fontFamily: 'Montserrat_600SemiBold',
    },
    focusedTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
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
import {Pressable, Text, StyleSheet, Image, View} from 'react-native';
import {Logo} from '../types/Logo.type';

interface ChannelCardButtonProps {
    title: string;
    logo?: Logo;
    onPress: () => void;
    isFocused?: boolean;
    hasTVPreferredFocus?: boolean;
}

export default function ChannelCardButton({
    title,
    logo,
    onPress,
    isFocused = false,
    hasTVPreferredFocus = false
}: ChannelCardButtonProps) {
    return (
        <Pressable
            style={[
                styles.container,
                isFocused && styles.focusedContainer
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
                    {title}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#333',
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
        backgroundColor: '#007AFF',
        transform: [{scale: 1.05}],
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {width: 0, height: 0},
        shadowColor: 'transparent',
        elevation: 0, // Pour Android
        overflow: 'hidden',
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
});
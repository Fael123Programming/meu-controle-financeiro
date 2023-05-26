import React, { useEffect, useState } from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable
} from 'react-native';
import { Colors } from '../utils/Colors';
import { Fonts } from '../utils/Fonts';
import { ProfilePicture } from '../components/ProfilePicture';
import { CustomButton } from '../components/CustomButton';
import { StackActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({route, navigation}) => {
    const [userData, setUserData] = useState({
        name: 'Marinna',
        surname: 'Silva',
        username: 'mari123',
        email: 'mari123@gmail.com',
        image: require('../assets/face1.jpg')
    });

    const splitSurname = userData.surname.split(' ');
    const surname = splitSurname[splitSurname.length - 1];

    return (
        <View style={styles.outerContainer}>
            <View style={styles.upperContainer}>
                <View style={styles.flexStart}>
                    <ProfilePicture
                        size='big'
                        src={userData.image}
                    />
                </View>
                <View style={[styles.flexEnd, {alignItems: 'center'}]}>
                    <Text style={[Fonts.displaySmall, {color: Colors.onPrimaryKeyColor}]}>{userData.name + ' ' + surname}</Text>
                    <Text style={[Fonts.bodyLarge, {color: Colors.onPrimaryKeyColor}]}>{userData.email}</Text>
                </View>
            </View>
            <View style={styles.profileBoard}>
                <Pressable
                    style={styles.pressable}
                    onPress={() => navigation.navigate('ProfileDetails')}
                >
                    <Ionicons name='settings-outline' size={24} color={Colors.onSecondaryKeyColor}/>
                    <Text style={[Fonts.headlineSmall, {marginLeft: '5%'}]}>Detalhes da Conta</Text> 
                </Pressable>
                <Pressable
                    style={styles.pressable}
                    onPress={() => navigation.navigate('Historic')}
                >
                    <Ionicons name='timer' size={24} color={Colors.onSecondaryKeyColor}/>
                    <Text style={[Fonts.headlineSmall, {marginLeft: '5%'}]}>Histórico</Text> 
                </Pressable>
                <Pressable
                    style={styles.pressable}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <Ionicons name='key' size={24} color={Colors.onSecondaryKeyColor}/>
                    <Text style={[Fonts.headlineSmall, {marginLeft: '5%'}]}>Alterar Palavra-Passe</Text> 
                </Pressable>
                <View
                    style={styles.buttonContainer}
                >
                    <CustomButton
                        text={'Terminar Sessão'}
                        backgroundColor={Colors.cardRed}
                        textColor={'white'}
                        widthPercentage={88}
                        onPress={() => {
                                Alert.alert(
                                    'Fazer logout',
                                    'Desejas sair da conta?',
                                    [
                                        {
                                            text: 'Sim',
                                            onPress: () => navigation.dispatch(StackActions.replace('Login'))
                                        },
                                        {
                                            text: 'Não',
                                        }
                                    ]
                                );
                            }
                        }
                        size={'big'}
                    />
                </View>
            </View> 
        </View> 
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.primaryKeyColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileBoard: {
        flex: 2,
        width: Dimensions.get('window').width,
        borderTopRightRadius: 60,
        borderTopLeftRadius: 60,
        backgroundColor: Colors.secondaryKeyColor,
        paddingHorizontal: '15%',
        paddingVertical: '2%',
        alignItems: 'baseline'
    },
    pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: '2%',
        marginVertical: '5%'
    },
    upperContainer: {
        flex: 1,
        marginVertical: '8%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    flexStart: {
        alignItems: 'flex-start'
    },
    flexEnd: {
        alignItems: 'flex-end'
    },
    buttonContainer: {
        flex: 1, 
        justifyContent: 'flex-end', 
        alignSelf: 'center'
    }
});

export { ProfileScreen };

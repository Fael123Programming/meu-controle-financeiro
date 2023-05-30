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
import {
    getAuth,
    signOut
} from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoadingIndicator } from '../components/LoadingIndicator';
import {
    useAppSelector,
    useAppDispatch
} from '../app/hooks';
import {
    selectUserData,
    setUserDataAsync
} from '../features/userData/userDataSlice';

const ProfileScreen = ({route, navigation}) => {
    const [isLoadingData, setLoadingData] = useState(true);

    const userData = useAppSelector(selectUserData);
    const status = useAppSelector(state => state.userData.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setUserDataAsync());
        setTimeout(() => {
            setLoadingData(false);
        }, 1000);
    }, []);

    function getFormattedName() {
        const splitSurname = userData.value.surname.split(' ');
        const surname = splitSurname[splitSurname.length - 1];
        return userData.value.name + ' ' + surname;
    }

    return isLoadingData || status === 'loading' ? (
        <LoadingIndicator/>
    ) : (
        <View style={styles.outerContainer}>
            <View style={styles.upperContainer}>
                <View style={styles.flexStart}>
                    <ProfilePicture
                        size='big'
                        src={userData.value.image}
                    />
                </View>
                <View style={[styles.flexEnd, {alignItems: 'center'}]}>
                    <Text style={[Fonts.displaySmall, {color: Colors.onPrimaryKeyColor}]}>{getFormattedName()}</Text>
                    <Text style={[Fonts.bodyLarge, {color: Colors.onPrimaryKeyColor}]}>{userData.value.email}</Text>
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
                                            onPress: async () => {
                                                try {
                                                    const auth = getAuth();
                                                    await signOut(auth);
                                                    navigation.dispatch(StackActions.replace('Login'));
                                                } catch (error) {
                                                    Alert.alert('Erro ao fazer log out', error.code + '\n' + error.message);
                                                }
                                            }
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
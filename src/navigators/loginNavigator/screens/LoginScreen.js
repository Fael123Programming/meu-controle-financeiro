import React, { useEffect, useState } from 'react';
import { 
    View,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    Pressable,
    Image,
} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import CustomTextInput from '../../../components/CustomTextInput';
import OkAlert from '../../../components/OkAlert';
import LoadingIndicator from '../../../components/LoadingIndicator';
import PasswordInput from '../../../components/PasswordInput';
import Colors from '../../../utils/Colors';
import Fonts from '../../../utils/Fonts';
import { StackActions } from '@react-navigation/native';
import { validateEmail, validatePassword } from '../../../utils/Validator';
import { signInGoogle, getAppGatewayAsync, isUserBlockedAsync } from '../../../../service';
import { 
    getAuth,
    signOut,
    sendEmailVerification,
    signInWithEmailAndPassword
} from 'firebase/auth';

function validateData(email, password){
    let message = {};
    if(validateEmail(email)) {
        if (validatePassword(password)) {
            message.header = 'Sucesso';
        } else {
            message.header = 'Padrão de Senha';
            message.body = 'A palavra-passe deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 caracter especial!';
        }
    } else {
        message.header = 'E-mail Inválido!';
        message.body = 'Endereço de e-mail inválido!';
    }
    return message;
}

const login = async (email, password) => {
    let message = {};
    try {
        const auth = getAuth();
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        await auth.currentUser.reload();
        let currentUser = auth.currentUser;
        if (!currentUser.emailVerified) {
            message.header = 'E-mail Não Verificado';
            message.body = 'Clique no link enviado para este e-mail para verificá-lo!';
            await sendEmailVerification(
                auth.currentUser, {
                handleCodeInApp: true,
                url: 'https://meu-controlo-financeiro.firebaseapp.com'
            });
            await signOut(auth);
            return message;
        } else if (await isUserBlockedAsync(email)) {
            message.header = 'Usuário Bloqueado';
            message.body = 'Infelizmente, este usuário foi bloqueado!';
            await signOut(auth);
            return message;
        }
    } catch (error) {
        switch (error.code) {
            case 'auth/user-not-found':
                message.header = 'Usuário Não Encontrado';
                message.body = 'Nenhum utilizador foi encontrado com essas credenciais!';
                break;
            case 'auth/wrong-password':
                message.header = 'Credenciais Inválidas';
                message.body = 'Suas credenciais não puderam ser validadas!';
                break;
            case 'auth/too-many-requests':
                message.header = 'Ops, Muitas Tentativas...';
                message.body = 'Tente novamente mais tarde!';
                break;
            default:
                message.header = error.code;
                message.body = error.body;
        }
        return message;
    }
};

const LoginScreen = ({route, navigation}) => {
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState('');

    const [emailInput, setEmailInput] = useState();
    const [passwordInput, setPasswordInput] = useState();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertDescription, setAlertDescription] = useState('');

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const [successOkAlertVisible, setSuccessOkAlertVisible] = useState(false);
    const [createdAccountEmail, setCreatedAccountEmail] = useState();

    const [loading, setLoading] = useState(false);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const subscriber = getAuth().onAuthStateChanged(async user => {
            user && setUser(user.emailVerified ? user : null);
            if (initializing)
                setInitializing(false);
        });
        return subscriber;
    }, []);

    useEffect(() => {
        (async () => {
            if (!loading)
                if (user) {
                    setOpacity(0);
                    setLoading(true);
                    let gateway = await getAppGatewayAsync();
                    navigation.dispatch(StackActions.replace(gateway));
                    setLoading(false);
                }
        })();
    }, [user]);

    useEffect(() => {
        if (route.params?.email) {
            setCreatedAccountEmail(route.params.email);
            setSuccessOkAlertVisible(true);
        }
    }, [route.params]);

    function cleanInputs() {
        setEmail('');
        setPassword('');
    }

    const {
        scrollView,
        title,
        subtitle,
        dollar,
        forgottenPasswordContainer,
        forgottenPasswordText,
        googleSignInContainer,
        googleLogo,
        accessGoogle,
        createAccount
    } = styles;

    if (initializing | loading)
        return <LoadingIndicator/>;

    return (
        <View style={[styles.outerContainer, {opacity: opacity}]}>
            <ScrollView
                contentContainerStyle={scrollView}
                keyboardDismissMode='on-drag'
            >
                <View>
                    <Text style={title}>Meu Controlo</Text>
                    <Text style={subtitle}>financeiro</Text>
                </View>
                <Text style={dollar}>$</Text>
                <CustomTextInput
                    state={email}
                    setState={setEmail}
                    placeholder='E-mail'
                    widthPercentage={90}
                    setRef={setEmailInput}
                    keyboardType='email-address'
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordInput.focus()}
                    maxLength={60}
                />
                <PasswordInput
                    state={password}
                    setState={setPassword}
                    setRef={setPasswordInput}
                />
                <View style={forgottenPasswordContainer}>
                    <Text 
                        style={forgottenPasswordText} 
                        onPress={() => navigation.navigate('ForgottenPasswordNavigator')}
                    >Esqueceu palavra-passe?</Text>
                </View>
                <View>
                    <CustomButton
                        text={'Entrar'}
                        backgroundColor={'#486D31'}
                        textColor={'white'}
                        width={88}
                        onPress={async () => {
                                setLoading(true);
                                let valRes = validateData(email, password);
                                if (valRes.header === 'Sucesso') {
                                    let logRes = await login(email, password);
                                    setLoading(false);
                                    if (logRes) {
                                        setAlertTitle(logRes.header);
                                        setAlertDescription(logRes.body);
                                        setAlertVisible(true);
                                    } else
                                        navigation.dispatch(StackActions.replace(await getAppGatewayAsync()));
                                } else {
                                    setLoading(false);
                                    setAlertTitle(valRes.header);
                                    setAlertDescription(valRes.body);
                                    setAlertVisible(true);
                                }
                            }
                        }
                    />
                </View>
                <Pressable
                    style={googleSignInContainer}
                    onPress={signInGoogle}
                >
                    <Image
                        source={require('../../../../assets/google.png')}
                        style={googleLogo}
                        resizeMode='contain'
                    />
                    <Text style={accessGoogle}>Acessar com Google</Text>
                </Pressable>
                <Text style={createAccount} onPress={() => navigation.navigate('CreateAccountNavigator')}>
                    Ir para criar conta
                </Text> 
            </ScrollView>
            <OkAlert
                visible={alertVisible}
                setVisible={setAlertVisible}
                title={alertTitle}
                description={alertDescription}
                onPressOk={() => {
                        setTimeout(() => {
                            cleanInputs();
                            emailInput.focus();
                        }, 200);
                    }
                }
            />
            <OkAlert
                visible={successOkAlertVisible}
                setVisible={setSuccessOkAlertVisible}
                title={'Validação de E-mail'}
                description={`Um e-mail contendo um link para validação foi enviado com sucesso para ${createdAccountEmail}`}
                onPressOk={() => setCreatedAccountEmail('')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222222',
    },
    scrollView: {
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height, 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginTop: '20%'
    },
    containerTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 40,
        marginLeft: 35,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    dollar: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'gold',
    },
    separandoConteudos:{
        marginTop: 80,
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 350,
        borderRadius: 2,  
        backgroundColor: '#D3D3D3',
    },
    forgottenPasswordContainer: {
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        marginBottom: 15,
    },
    forgottenPasswordText:{
        textDecorationLine: 'underline',
        color: '#FFFFFF',
    },
    createAccount: {
        textDecorationLine: 'underline',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: '30%',
    },
    googleSignInContainer: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width * .88,
        height: Dimensions.get('window').height * .047,
        borderRadius: 20,
        margin: '2.5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    googleLogo: {
        flex: 1, 
        width: Dimensions.get('window').width * .085, 
        height: Dimensions.get('window').height * .041, 
    },
    accessGoogle: {
        flex: 3,
        ...Fonts.headlineSmall, 
    },
    passwordInput: {
        flexDirection: 'row',
        backgroundColor: Colors.secondaryKeyColor,
        borderColor: Colors.onSecondaryKeyColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: '2%',
        marginHorizontal: '2%',
        width: Dimensions.get('window').width * .9
    }
});
        
export default LoginScreen;

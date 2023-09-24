import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';
import {
    getAuth,
    signOut,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    deleteDoc
} from 'firebase/firestore';
import AdminButton from '../../../components/AdminButton';
import { selectUserData } from '../../../../../features/userData/userDataSlice';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import { setUserDataAsync } from '../../../../../features/userData/userDataSlice';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import CustomTextInput from '../../../../../components/CustomTextInput';
import YesNoAlert from '../../../../../components/YesNoAlert';
import OkAlert from '../../../../../components/OkAlert';
import { validateEmail } from '../../../../../utils/Validator';
import { emailNotExistsOnAppAsync } from '../../../../../../service';
import { 
    firestore,
} from '../../../../../../firebase.config';
import Prompt from '../../../components/Prompt';
/**
 * {"status": "idle", 
 * "value": {
 * "birthdayDate": "2002-06-11", 
 * "city": "Bragança", 
 * "email": "rafaelfonseca1020@gmail.com", 
 * "id": 4, 
 * "image": {
 * "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Forgs-projeto-f297f5fb-201d-463e-a388-be91e7e85f5f/ImagePicker/64c88384-c9a9-4e51-9392-0a7a4550a9a4.jpeg"
 * }, 
 * "name": "Rafael", 
 * "postcode": "1234-567", 
 * "street": "Rua 42", 
 * "surname": "Guimarães", 
 * "username": "rafa_guima"}} 
 * */

const MyProfileScreen = ({navigation}) => {
    const userData = useAppSelector(selectUserData);
    const userDataStatus = useAppSelector(state => state.userData.status);

    const dispatch = useAppDispatch();

    const [email, setEmail] = useState();
    const [logOutBtnOpacity, setLogOutBtnOpacity] = useState(1);

    const [confirmLogOutAlertVisible, setConfirmLogOutAlertVisible] = useState(false);
    const [okAlertVisible, setOkAlertVisible] = useState(false);
    const [okAlertDescription, setOkAlertDescription] = useState(false);

    const [promptVisible, setPromptVisible] = useState(false);
    const [promptText, setPromptText] = useState('');

    useEffect(() => {
        dispatch(setUserDataAsync());
    }, []);

    useEffect(() => {
        setEmail(userData.value.email);
    }, [userData]);
 
    const { 
        outerContainer,
        buttonContainer,
        innerContainer,
        topLabel,
        rowContainer,
        bottomButtonsContainer,
        btnContainer
    } = styles;

    if (userDataStatus == 'loading')
        return <LoadingIndicator/>

    const emailValidation = async _ => {
        if (email != userData.value.email) {
            if (!validateEmail(email)) {
                setEmail(userData.value.email);
                setOkAlertDescription('E-mail inválido');
                setOkAlertVisible(true);
            } else if (!await emailNotExistsOnAppAsync(email, userData.value.id)) {
                setEmail(userData.value.email);
                setOkAlertDescription('E-mail já em uso');
                setOkAlertVisible(true);
            } else
                setPromptVisible(true);
        }
    };
    
    const validatePassword = async _ => {
        const user = getAuth().currentUser;
        const cred = EmailAuthProvider.credential(user.email, promptText);
        reauthenticateWithCredential(user, cred)
        .then(async () => {
            await updateEmail(user, email);
            const oldDataDoc = doc(firestore, 'users', userData.value.email);
            const data = (await getDoc(oldDataDoc)).data();
            data.email = email;
            await setDoc(doc(firestore, 'users', email), data);
            await deleteDoc(oldDataDoc);
            setOkAlertDescription(`Um e-mail de confirmação foi enviado para '${email}'`);
            setOkAlertVisible(true);
            dispatch(setUserDataAsync());
        }).catch(error => {
            setPromptVisible(false);
            setEmail(userData.value.email);
            setOkAlertDescription('Senha inválida!');
            setOkAlertVisible(true);
            console.log(error);
            setPromptText('');
        });
    };

    return (
        <View style={outerContainer}>
            <ScrollView
                contentContainerStyle={innerContainer}
                keyboardDismissMode='on-drag'
            >
                <View style={{ flex: 1 }}>
                    <Text style={topLabel}>E-mail</Text>
                    <CustomTextInput
                        state={email}
                        setState={setEmail}
                        placeholder='E-mail'
                        keyboardType='email-address'
                        width={90}
                        marginTop={1}
                        backgroundColor={'white'}
                        onFocus={_ => setLogOutBtnOpacity(0)}
                        onBlur={_ => setLogOutBtnOpacity(1)}
                    />
                    <View style={[rowContainer, bottomButtonsContainer]}>
                        <View style={btnContainer}>
                            <AdminButton
                                text={'Mudar Palavra-Passe'}
                                onPress={_ => navigation.navigate('ChangePasswordAdmin')}
                            />
                        </View>
                    <View style={btnContainer}>
                        <AdminButton 
                            text={'Salvar'}
                            onPress={emailValidation}
                        />
                    </View>
                </View>
                </View>
                <View style={[buttonContainer, {opacity: logOutBtnOpacity}]}>
                    <AdminButton
                        text={'Sair'}
                        onPress={_ => setConfirmLogOutAlertVisible(true)}
                        backgroundColor='#990f00'
                        underlayColor='#ff1900'
                    />
                </View>
            </ScrollView>
            <YesNoAlert
                visible={confirmLogOutAlertVisible}
                setVisible={setConfirmLogOutAlertVisible}
                title={'Terminar Sessão'}
                description={'Desejas realmente encerrar a sessão?'}
                onPressYes={async () => {
                        const auth = getAuth();
                        await signOut(auth);
                        navigation.replace('Login');
                    }
                }
            />
            <OkAlert
                visible={okAlertVisible}
                setVisible={setOkAlertVisible}
                title='Salvar E-mail'
                description={okAlertDescription}
            />
            <Prompt
                visible={promptVisible}
                setVisible={setPromptVisible}
                title={'Confirmar Senha'}
                description={'Digite sua senha abaixo'}
                text={promptText}
                setText={setPromptText}
                secureTextEntry={true}
                onFocus={_ =>  setLogOutBtnOpacity(0)}
                onBlur={_ => setLogOutBtnOpacity(1)}
                onPressCancel={_ => setEmail(userData.value.email)}
                onPressConfirm={validatePassword}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: '5%',
        width: Dimensions.get('window').width,
    },
    buttonContainer: {
        width: Dimensions.get('window').width * .9,
    },
    topLabel: {
        alignSelf: 'flex-start',
        marginLeft: '2%',
        fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    bottomButtonsContainer: {
        marginTop: 20,
        width: 390, 
        justifyContent: 'space-evenly'
    },
    btnContainer: {
        flex: 1, 
        margin: 10
    },
});

export default MyProfileScreen;

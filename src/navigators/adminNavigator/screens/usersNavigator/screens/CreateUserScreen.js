import React, { useState, useEffect } from 'react';
import {
    Pressable,
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    Switch
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../../../features/cities/citiesSlice';
import { selectUserMinAge, setUserMinAgeAsync } from '../../../../../features/userMinAge/userMinAgeSlice';
import CustomTextInput from '../../../../../components/CustomTextInput';
import CustomDatePicker from '../../../../../components/CustomDatePicker';
import SearchDropdown from '../../../../../components/SearchDropdown';
import PostalCodeInput from '../../../../../components/PostalCodeInput';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import ProfilePicture from '../../../../../components/ProfilePicture';
import PickImageModal from '../../../../../components/PickImageModal';
import AdminButton from '../../../components/AdminButton';
import PasswordInput from '../../../../../components/PasswordInput';
import { validateUserData, validatePassword, validateEmail } from '../../../../../utils/Validator';
import {
    createUserWithEmailAndPassword, 
    getAuth,
    sendEmailVerification
} from 'firebase/auth';
import OkAlert from '../../../../../components/OkAlert';
import { createNewUserAsync, createNewAdminAsync, emailDoesNotExistOnAppAsync } from '../../../../../../service';
import { Snackbar } from 'react-native-paper';

const CreateUserScreen = ({route, navigation}) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState();
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState();

    const [pullBack, setPullBack] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [surnameInput, setSurnameInput] = useState();
    const [usernameInput, setUsernameInput] = useState();
    const [cityInput, setCityInput] = useState();
    const [postalCodeInput, setPostalCodeInput] = useState();
    const [emailInput, setEmailInput] = useState();
    const [passwordInput, setPasswordInput] = useState();
    const [passwordRepeatInput, setPasswordRepeatInput] = useState();

    const [adminUser, setAdminUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avoidUseEffect, setAvoidUseEffect] = useState(false);

    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(status => status.cities.status);

    const userMinAge = useAppSelector(selectUserMinAge);
    const userMinAgeStatus = useAppSelector(state => state.userMinAge.status);

    const [errorOkAlertVisible, setErrorOkAlertVisible] = useState(false);
    const [errorOkAlertTitle, setErrorOkAlertTitle] = useState('');
    const [errorOkAlertDescription, setErrorOkAlertDescription] = useState('');

    const [visibleSnackbar, setVisibleSnackbar] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCitiesAsync());
        dispatch(setUserMinAgeAsync());
    }, []);

    useEffect(() => navigation.addListener('beforeRemove', e => {
    }), [navigation]);

    const {
        outerContainer,
        innerContainer,
        topLabel,
        softView,
        rowContainer,
        bold
    } = styles;

    if (citiesStatus === 'loading' || userMinAgeStatus === 'loading' || loading)
        return <LoadingIndicator/>

    const postcodeType = [4, 3];

    const getTrimmed = () => {
        return {
            name: name?.trim(),
            username: username?.trim(),
            surname: surname?.trim(),
            street: street?.trim(),
            city: city?.trim(),
            postcode: postalCode?.trim(),
            email: email?.trim(),
            password: password?.trim(),
            confirmPassword: confirmPassword?.trim()
        };
    }

    return (
        <View style={outerContainer}>
            <ScrollView
                contentContainerStyle={
                    [
                        innerContainer, 
                        !adminUser ? {
                            height: Dimensions.get('window').height * 1.5
                        } : {}
                    ]
                }
                keyboardDismissMode='on-drag'
            >
                <Text style={[topLabel, bold]}>Tipo de Utilizador</Text>
                <View style={[rowContainer, softView]}>
                    <Pressable 
                        style={{flex: 1}}
                        onPress={_ => setAdminUser(false)}
                    >
                        <Text style={{textAlign: 'center'}}>Comum</Text>
                    </Pressable>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Switch
                            value={adminUser}
                            onValueChange={admin => {
                                    setAdminUser(admin);
                                    if (admin)
                                        emailInput.focus();
                                }
                            }
                            thumbColor={'#0077ff'}
                            trackColor={'#0077ff'}
                            ios_backgroundColor={'#0077ff'}
                        />
                    </View>
                    <Pressable 
                        style={{flex: 1}}
                            onPress={_ => {setAdminUser(true); emailInput.focus(); }}
                    >
                        <Text style={{textAlign: 'center'}}>Administrador</Text>
                    </Pressable>
                </View>
                {
                    !adminUser &&
                    (
                        <>
                            <View style={{marginTop: '5%'}}>
                                <ProfilePicture
                                    onPress={() => setModalVisible(true)}
                                    size='big'
                                    src={image}
                                />
                            </View>
                            <Text style={[topLabel, bold]}>Nome</Text>
                            <CustomTextInput
                                state={name}
                                setState={setName}
                                placeholder='Nome'
                                backgroundColor={'white'}
                                autofocus={true}
                                marginTop={1}
                                onSubmitEditing={_ => surnameInput.focus()}
                                blurOnSubmit={false}
                            />
                            <Text style={[topLabel, bold]}>Apelido</Text>
                            <CustomTextInput
                                state={surname}
                                setState={setSurname}
                                placeholder='Apelido'
                                backgroundColor={'white'}
                                marginTop={1}
                                setRef={setSurnameInput}
                                onSubmitEditing={_ => usernameInput.focus()}
                                blurOnSubmit={false}
                            />
                            <Text style={[topLabel, bold]}>Nome de Utilizador</Text>
                            <CustomTextInput
                                state={username}
                                setState={setUsername}
                                placeholder='Nome de Utilizador'
                                backgroundColor={'white'}
                                marginTop={1}
                                setRef={setUsernameInput}
                            />
                            <Text style={[topLabel, bold]}>Data de Nascimento</Text>
                            <CustomDatePicker
                                state={birthday}
                                setState={setBirthday}
                                marginTop={1}
                            />
                            <Text style={[topLabel, bold]}>Endereço</Text>
                            <View>
                                <View style={[rowContainer, {marginTop: '2%'}]}>
                                    <View style={softView}>
                                        <Text style={topLabel}>Logradouro</Text>
                                        <CustomTextInput
                                            placeholder='Logradouro'
                                            width={43}
                                            marginTop={1}
                                            state={street}
                                            setState={setStreet}
                                            maxLength={100}
                                            onSubmitEditing={() => cityInput.focus()}
                                            blurOnSubmit={false}
                                            backgroundColor={'white'}
                                        />
                                    </View>
                                    <View style={softView}>
                                        <Text style={topLabel}>Cidade</Text>
                                        <SearchDropdown
                                            state={city}
                                            setState={setCity}
                                            placeholder={'Cidade'}
                                            marginTop={1}
                                            marginBottom={2}
                                            options={cities.value}
                                            onFocus={() => setPullBack(true)}
                                            onChosen={() => {
                                                    setPullBack(false);
                                                    postalCodeInput.focus();
                                                }
                                            }
                                            setRef={setCityInput}
                                            backgroundColor={'white'}
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                                <Text style={[topLabel, {marginLeft: '2%'}]}>Código Postal</Text>
                                <PostalCodeInput
                                    code={postalCode}
                                    setCode={setPostalCode}
                                    setRef={setPostalCodeInput}
                                    width={43}
                                    marginTop={1}
                                    type={postcodeType}  // xxxx-xxx
                                    placeholder={'Código Postal'}
                                    backgroundColor={'white'}
                                    onSubmitEditing={_ => emailInput.focus()}
                                    blurOnSubmit={false}
                                />
                            </View>
                        </>
                    )
                }
                <Text style={[topLabel, bold]}>E-mail</Text>
                <CustomTextInput
                    state={email}
                    setState={setEmail}
                    placeholder='E-mail'
                    keyboardType='email-address'
                    width={90}
                    marginTop={1}
                    backgroundColor={'white'}
                    pullBack={pullBack}
                    setRef={setEmailInput}
                    onSubmitEditing={_ => passwordInput.focus()}
                    blurOnSubmit={false}
                />
                <Text style={[topLabel, bold]}>Palavra-Passe</Text>
                <PasswordInput
                    state={password}
                    setState={setPassword}
                    marginTop={1}
                    backgroundColor={'white'}
                    setRef={setPasswordInput}
                    onSubmitEditing={_ => passwordRepeatInput.focus()}
                    blurOnSubmit={false}
                />
                <Text style={[topLabel, bold]}>Repetir Palavra-Passe</Text>
                <PasswordInput
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    marginTop={1}
                    marginBottom={3}
                    backgroundColor={'white'}
                    placeholder='Repetir Palavra-Passe'
                    setRef={setPasswordRepeatInput}
                />
                <View style={{width: 370}}>
                    <AdminButton 
                        text={'Criar'}
                        onPress={async () => {
                            if (adminUser) {
                                let tEmail = email.trim(), tPassword = password.trim(), tConfirmPassword = confirmPassword.trim();
                                if (validateEmail(tEmail)) {
                                    if (await emailDoesNotExistOnAppAsync(tEmail)) {
                                        if (validatePassword(tPassword)) {
                                            if (tPassword === tConfirmPassword) {
                                                setAvoidUseEffect(true);
                                                setLoading(true);
                                                let auth = getAuth();
                                                await createUserWithEmailAndPassword(auth, tEmail, tPassword)
                                                .then(_ => {
                                                    sendEmailVerification(
                                                        auth.currentUser, {
                                                        handleCodeInApp: true,
                                                        url: 'https://meu-controlo-financeiro.firebaseapp.com'
                                                    }).then(async _ => {
                                                        await createNewAdminAsync(tEmail);
                                                        setLoading(false);
                                                        setVisibleSnackbar(true);
                                                    }).catch(err => {
                                                        setErrorOkAlertTitle('Erro ao Tentar Criar Conta');
                                                        setErrorOkAlertDescription(err.message);
                                                        setErrorOkAlertVisible(true);
                                                    });
                                                }).catch(err => {
                                                    setErrorOkAlertTitle('Erro ao Tentar Criar Conta');
                                                    setErrorOkAlertDescription(err.message);
                                                    setErrorOkAlertVisible(true);
                                                });
                                            } else {
                                                setErrorOkAlertTitle('Palavra-Passe e Confirmação');
                                                setErrorOkAlertDescription('A palavra passe e confirmação da palavra-passe diferem!');
                                                setErrorOkAlertVisible(true);
                                            }
                                        } else {
                                            setErrorOkAlertTitle('Palavra-Passe');
                                            setErrorOkAlertDescription('A palavra-passe deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 caracter especial!');
                                            setErrorOkAlertVisible(true);
                                        }
                                    } else {
                                        setErrorOkAlertTitle('E-mail Repetido');
                                        setErrorOkAlertDescription('O e-mail já está em uso!');
                                        setErrorOkAlertVisible(true);
                                    }
                                } else {
                                    setErrorOkAlertTitle('Formato do E-mail');
                                    setErrorOkAlertDescription('O e-mail possui formato inválido!');
                                    setErrorOkAlertVisible(true);
                                }
                            } else {
                                let trimmedData = getTrimmed();
                                let res = await validateUserData(
                                    trimmedData?.name, 
                                    trimmedData?.surname, 
                                    trimmedData?.username, 
                                    birthday, 
                                    trimmedData?.street,
                                    trimmedData?.city,
                                    trimmedData?.postcode,
                                    trimmedData?.email, 
                                    userMinAge.value,
                                    cities.value,
                                    postcodeType
                                );
                                if (res.header === 'ok') {
                                    if (validatePassword(trimmedData.password)) {
                                        if (trimmedData.password === trimmedData.confirmPassword) {
                                            setAvoidUseEffect(true);
                                            setLoading(true);
                                            let auth = getAuth();
                                            await createUserWithEmailAndPassword(auth, trimmedData?.email, trimmedData?.password)
                                            .then(_ => {
                                                sendEmailVerification(
                                                    auth.currentUser, {
                                                    handleCodeInApp: true,
                                                    url: 'https://meu-controlo-financeiro.firebaseapp.com'
                                                }).then(async _ => {
                                                    await createNewUserAsync(
                                                        trimmedData?.name, 
                                                        trimmedData?.surname, 
                                                        trimmedData?.username, 
                                                        birthday, 
                                                        trimmedData?.street,
                                                        trimmedData?.city,
                                                        trimmedData?.postcode,
                                                        trimmedData?.email
                                                    );
                                                    setLoading(false);
                                                }).catch(err => {
                                                    setErrorOkAlertTitle('Erro ao Tentar Criar Conta');
                                                    setErrorOkAlertDescription(err.message);
                                                    setErrorOkAlertVisible(true);
                                                });
                                            }).catch(err => {
                                                setErrorOkAlertTitle('Erro ao Tentar Criar Conta');
                                                setErrorOkAlertDescription(err.message);
                                                setErrorOkAlertVisible(true);
                                            });
                                        } else {
                                            setErrorOkAlertTitle('Palavra-Passe e Confirmação');
                                            setErrorOkAlertDescription('A palavra passe e confirmação da palavra-passe diferem!');
                                            setErrorOkAlertVisible(true);
                                        }
                                    } else {
                                        setErrorOkAlertTitle('Palavra-Passe');
                                        setErrorOkAlertDescription('A palavra-passe deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 caracter especial!');
                                        setErrorOkAlertVisible(true);
                                    }
                                } else {
                                    setErrorOkAlertTitle(res.header);
                                    setErrorOkAlertDescription(res.body);
                                    setErrorOkAlertVisible(true);
                                }
                            }
                        }
                    }
                    />
                </View>
            </ScrollView>
            <PickImageModal
                state={modalVisible}
                setState={setModalVisible}
                image={image}
                setImage={setImage}
            />
            <OkAlert
                visible={errorOkAlertVisible}
                setVisible={setErrorOkAlertVisible}
                title={errorOkAlertTitle}
                description={errorOkAlertDescription}
            />
            <Snackbar
                visible={visibleSnackbar}
                onDismiss={() => {setVisibleSnackbar(false); navigation.goBack();}}
                duration={1000}
            >
                Usuário criado com sucesso!
            </Snackbar>
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
        alignItems: 'center',
        marginTop: '5%',
        width: Dimensions.get('window').width,
    },
    topLabel: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
    },
    softView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    bold: {
        fontWeight: 'bold'
    }
});

export default CreateUserScreen;

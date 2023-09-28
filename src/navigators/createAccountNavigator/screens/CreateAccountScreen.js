import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import Colors from '../../../utils/Colors';
import CustomTextInput from '../../../components/CustomTextInput';
import TermsAndConditions from '../../../components/TermsAndConditions'; 
import CustomButton from '../../../components/CustomButton';
import PasswordInput from '../../../components/PasswordInput';
import OkAlert from '../../../components/OkAlert';
import YesNoAlert from '../../../components/YesNoAlert';
import LoadingIndicator from '../../../components/LoadingIndicator';
import CustomDatePicker  from '../../../components/CustomDatePicker';
import SearchDropdown from '../../../components/SearchDropdown';
import PostalCodeInput from '../../../components/PostalCodeInput';
import { createNewUserAsync } from '../../../../service';
import { validateUserData, validatePassword } from '../../../utils/Validator';
import {
    createUserWithEmailAndPassword, 
    getAuth,
    sendEmailVerification
} from 'firebase/auth';
import { getValidBirthdayDate } from '../../../utils/Date';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../features/cities/citiesSlice';
import { selectUserMinAge, setUserMinAgeAsync } from '../../../features/userMinAge/userMinAgeSlice';

const CreateAccountScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthday, setBirthday] = useState();
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [modalOpenState, setModalOpenState] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checked, setChecked] = useState(false);

    const [nameInput, setNameInput] = useState();
    const [surnameInput, setSurnameInput] = useState();
    const [usernameInput, setUsernameInput] = useState();
    const [cityInput, setCityInput] = useState();
    const [postalCodeInput, setPostalCodeInput] = useState();
    const [emailInput, setEmailInput] = useState();
    const [passwordInput, setPasswordInput] = useState();
    const [confirmPasswordInput, setConfirmPasswordInput] = useState();

    const [avoidUseEffect, setAvoidUseEffect] = useState(false);

    const [errorOkAlertVisible, setErrorOkAlertVisible] = useState(false);
    const [errorOkAlertTitle, setErrorOkAlertTitle] = useState('');
    const [errorOkAlertDescription, setErrorOkAlertDescription] = useState('');

    const [yesNoAlertVisible, setYesNoAlertVisible] = useState(false);
    const [action, setAction] = useState();

    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('');

    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(state => state.cities.status);

    const userMinAge = useAppSelector(selectUserMinAge);
    const userMinAgeStatus = useAppSelector(state => state.userMinAge.status);

    const [pullBack, setPullBack] = useState(false);

    const dispatch = useAppDispatch();

    const postcodeType = [4, 3];

    useEffect(() => {
        dispatch(setUserMinAgeAsync());
        dispatch(setCitiesAsync());
    }, []);

    useEffect(() => {
        if (userMinAge?.value)
            setDate(getValidBirthdayDate(userMinAge.value));
    }, [userMinAge]);

    useEffect(() => navigation.addListener('beforeRemove', e => {
        let action = e.data.action;
        if (!avoidUseEffect) {
            e.preventDefault();
            setAction(action);
            setYesNoAlertVisible(true);
        }
    }), [navigation, avoidUseEffect]);

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
    };

    const {
        outerContainer,
        scrollView,
        nameSurnameContainer,
        softView,
        topLabel,
        superTopLabel,
        addressRowView
    } = styles;

    return loading || citiesStatus === 'loading' || userMinAgeStatus === 'loading' ? (
        <LoadingIndicator loadingMessage={loadingMsg}/>
    ) : (
        <View style={outerContainer}>
            <ScrollView 
                keyboardDismissMode={'on-drag'}
                contentContainerStyle={scrollView}
            >
                <View style={nameSurnameContainer}>
                    <View style={softView}>
                        <Text style={topLabel}>Nome</Text>
                        <CustomTextInput
                            placeholder={'Nome'}
                            width={43}
                            marginTop={0}
                            marginBottom={2}
                            state={name}
                            setState={setName}
                            autofocus={true}
                            setRef={setNameInput}
                            onSubmitEditing={() => surnameInput?.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={softView}>
                        <Text style={topLabel}>Apelido</Text>
                        <CustomTextInput
                            placeholder='Apelido'
                            width={43}
                            marginTop={0}
                            marginBottom={2}
                            state={surname}
                            setState={setSurname}
                            setRef={setSurnameInput}
                            onSubmitEditing={() => usernameInput?.focus()}
                            blurOnSubmit={false}
                        />                   
                    </View> 
                </View>
                <Text style={topLabel}>Nome de Utilizador</Text>
                <CustomTextInput
                    placeholder={'Nome de utilizador'}
                    width={90}
                    marginTop={0}
                    marginBottom={3}
                    state={username}
                    setState={setUsername}
                    marginBottomPercentage={4}
                    setRef={setUsernameInput}
                />
                <Text style={topLabel}>Data de Nascimento</Text>
                <CustomDatePicker
                    state={birthday}
                    setState={setBirthday}
                    width={90}
                    marginTop={0}
                    marginBottom={3}
                    modalOpenState={modalOpenState}
                    setModalOpenState={setModalOpenState}
                />
                <View style={softView}>
                    <Text style={[superTopLabel, {fontWeight: 'bold'}]}>Endereço</Text>
                    <View style={addressRowView}>
                        <View style={softView}>
                            <Text style={topLabel}>Logradouro</Text>
                            <CustomTextInput
                                placeholder='Logradouro'
                                width={43}
                                marginTop={0}
                                marginBottom={3}
                                state={street}
                                setState={setStreet}
                                maxLength={100}
                                onSubmitEditing={() => cityInput.focus()}
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={softView}>
                            <Text style={topLabel}>Cidade</Text>
                            <SearchDropdown
                                state={city}
                                setState={setCity}
                                placeholder={'Cidade'}
                                marginTop={0}
                                marginBottom={3}
                                options={cities.value}
                                onFocus={() => setPullBack(true)}
                                onChosen={() => {
                                        setPullBack(false);
                                        postalCodeInput?.focus();
                                    }
                                }
                                setRef={setCityInput}
                            />
                        </View>
                    </View>
                    <View style={{alignSelf: 'flex-start'}}>
                        <Text style={superTopLabel}>Código Postal</Text>
                        <PostalCodeInput
                            code={postalCode}
                            setCode={setPostalCode}
                            setRef={setPostalCodeInput}
                            width={43}
                            marginTop={0}
                            marginBottom={3}
                            type={postcodeType}  // xxxx-xxx
                            placeholder={'Código Postal'}
                            onSubmitEditing={() => emailInput?.focus()}
                            blurOnSubmit={false}
                        />
                    </View>
                </View>
                <Text style={topLabel}>E-mail</Text>
                <CustomTextInput
                    placeholder={'E-mail'}
                    width={90}
                    marginTop={0}
                    marginBottom={3}
                    state={email}
                    setState={setEmail}
                    keyboardType={'email-address'}
                    setRef={setEmailInput}
                    onSubmitEditing={() => passwordInput.focus()}
                    blurOnSubmit={false}
                    maxLength={60}
                    pullBack={pullBack}
                />
                <Text style={topLabel}>Palavra-Passe</Text>
                <PasswordInput
                    state={password}
                    setState={setPassword}
                    width={90}
                    marginBottom={3}
                    marginTop={0}
                    setRef={setPasswordInput}
                    onSubmitEditing={() => confirmPasswordInput.focus()}
                    blurOnSubmit={false}
                    pullBack={pullBack}
                />
                <Text style={topLabel}>Repita Palavra-Passe</Text>
                <PasswordInput
                    state={confirmPassword}
                    setState={setConfirmPassword}
                    width={90}
                    marginBottom={3}
                    marginTop={0}
                    placeholder='Confirmar palavra-passe'
                    setRef={setConfirmPasswordInput}
                    pullBack={pullBack}
                />
                <TermsAndConditions
                    state={checked}
                    setState={setChecked}
                />
                <View style={{marginTop: '5%'}}>
                    <CustomButton
                        text={'Criar'}
                        onPress={async () => {
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
                                            setLoadingMsg('Criando conta...');
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
                                                    setLoadingMsg('');
                                                    navigation.navigate('Login', {
                                                        email: trimmedData.email
                                                    });
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
                        backgroundColor={checked ? Colors.tertiaryKeyColor : Colors.tertiaryKeyColorDisabled}
                        textColor={Colors.onPrimaryKeyColor}
                        widthPercentage={95}
                        disabled={!checked}
                    />
                </View>
            </ScrollView>
            <OkAlert
                visible={errorOkAlertVisible}
                setVisible={setErrorOkAlertVisible}
                title={errorOkAlertTitle}
                description={errorOkAlertDescription}
            />
            <YesNoAlert
                visible={yesNoAlertVisible}
                setVisible={setYesNoAlertVisible}
                title={'Criação de Conta'}
                description={'Se voltares os dados serão perdidos. Desejas realmente fazer isso?'}
                onPressYes={() => navigation.dispatch(action)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryKeyColor,
    },
    scrollView: {
        height: Dimensions.get('window').height * 1.3,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        marginTop: '5%',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        backgroundColor: Colors.secondaryKeyColor
    },
    nameSurnameContainer: {
        flexDirection: 'row', 
        marginTop: '10%',
        marginBottom: '2%'
    },
    topLabel: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginBottom: '2%'
    },
    superTopLabel: {
        marginLeft: '2%', 
        alignSelf: 'flex-start', 
        marginBottom: '2%'
    },
    softView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    addressRowView: {
        flexDirection: 'row',
    },
    postalCode: {
        marginLeft: '2%', 
        marginBottom: '2%'
    }
});

export default CreateAccountScreen ;

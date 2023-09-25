import React, { useState, useEffect } from 'react';
import {
    Alert,
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    Keyboard
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectCities, setCitiesAsync } from '../../../../../features/cities/citiesSlice';
import CustomTextInput from '../../../../../components/CustomTextInput';
import CustomDatePicker from '../../../../../components/CustomDatePicker';
import SearchDropdown from '../../../../../components/SearchDropdown';
import PostalCodeInput from '../../../../../components/PostalCodeInput';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import ProfilePicture from '../../../../../components/ProfilePicture';
import PickImageModal from '../../../../../components/PickImageModal';
import AdminButton from '../../../components/AdminButton';
import { 
    usernameNotTakenAsync, 
    emailNotExistsOnAppAsync 
} from '../../../../../../service';
import { validatePostcode } from '../../../../../utils/Validator';
import {
    doc,
    setDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import {
    getAuth,
    sendEmailVerification,
    updateEmail
} from 'firebase/auth';
import { setUserDataAsync } from '../../../../../features/userData/userDataSlice';
import { Snackbar } from 'react-native-paper';
import { setUsersAsync } from '../../../../../features/users/usersSlice';
import {
    ref,
    uploadBytes,
    deleteObject,
    getDownloadURL
} from 'firebase/storage';
import { 
    firestore,
    storage
} from '../../../../../../firebase.config';

const drawPostcodePattern = postcodeType => {
    let str = '';
    for (let i = 0; i < postcodeType[0]; i++)
        str += 'x';
    str += '-';
    for (let i = 0; i < postcodeType[1]; i++)
        str += 'x';
    return str;
};

const UserDetailsScreen = ({route, navigation}) => {
    const { user } = route.params;

    const [name, setName] = useState(user?.name);
    const [surname, setSurname] = useState(user?.surname);
    const [username, setUsername] = useState(user?.username);
    const [birthday, setBirthday] = useState(user?.birthdayDate);
    const [street, setStreet] = useState(user?.street);
    const [city, setCity] = useState(user?.city);
    const [postalCode, setPostalCode] = useState(user?.postcode);
    const [email, setEmail] = useState(user?.email);
    const [image, setImage] = useState(user?.image);
    const [pullBack, setPullBack] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [visibleSnackbar, setVisibleSnackbar] = useState(false);
    const [surnameInput, setSurnameInput] = useState();
    const [usernameInput, setUsernameInput] = useState();
    const [cityInput, setCityInput] = useState();
    const [postalCodeInput, setPostalCodeInput] = useState();

    const [loading, setLoading] = useState(false);
    const [nameFocus, setNameFocus] = useState(true);

    const cities = useAppSelector(selectCities);
    const citiesStatus = useAppSelector(status => status.cities.status);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setCitiesAsync());
    }, []);

    // useEffect(() => navigation.addListener('beforeRemove', e => {
    // }), [navigation]);
    
    const postcodeType = [4, 3];

    const checkData = async _ => {
        let trimmedName = name.trim(), 
        trimmedSurname = surname.trim(), 
        trimmedUsername = username.trim(),
        trimmedStreet = street.trim(),
        trimmedCity = city.trim(),
        trimmedPostcode = postalCode.trim();
        if (trimmedName != user?.name) {
            if (trimmedName.length < 2) {
                Alert.alert('Nome Inválido', 'O campo de nome deve ter pelos menos 2 caracteres');
                setName(user?.name);
                return false;
            }
        } 
        if (trimmedSurname != user?.surname) {
            if (trimmedSurname.length < 2) {
                Alert.alert('Sobrenome Inválido', 'O campo de sobrenome deve ter pelos menos 2 caracteres');
                setSurname(user?.surname);
                return false;
            }
        } 
        if (trimmedUsername != user?.username) {
            if (trimmedUsername.length < 2) {
                Alert.alert('Nome de Utilizador Inválido', 'O campo de nome de utilizador deve ter pelos menos 2 caracteres');
                setUsername(user?.username);
                return false;
            }
            if (!await usernameNotTakenAsync(trimmedUsername)) {
                Alert.alert('Nome de Utilizador Já em Uso', 'O campo de nome de utilizador já está em uso');
                setUsername(user?.username);
                return false;
            }
        }
        if (trimmedStreet != user?.street) {
            if (trimmedStreet.length < 2) {
                Alert.alert('Logradouro Inválido', 'O logradouro deve ter pelos menos 2 caracteres');
                setStreet(user?.street);
                return false;
            }
        }
        if (trimmedCity != user?.city) {
            if (trimmedCity.length < 2) {
                Alert.alert('Cidade Inválida', 'O nome da cidade deve ter pelos menos 2 caracteres');
                setCity(user?.city);
                return false;
            }
            if (cities.value.filter(ele => ele?.label?.toLowerCase() === city?.toLowerCase()).length == 0) {
                Alert.alert('Cidade Desconhecida', 'A cidade digitada não foi encontrada na base de dados');
                setCity(user?.city);
                return false;
            }
        }
        if (trimmedPostcode != user?.postcode) {
            if (!validatePostcode(trimmedPostcode, postcodeType)) {
                Alert.alert('Código Postal Inválido', `O código postal deve ter o formato ${drawPostcodePattern(postcodeType)}`);
                setPostalCode(user?.postcode);
                return false;
            }
        }
        return true;
    };

    const onUpdate = async _ => {
        let updateStatus = await checkData();
        if (updateStatus) {
            setLoading(true);
            const profileImagePath = 'users/' + email + '/images/profile/profile.jpeg';
            const profileRef = ref(storage, profileImagePath);
            const docRef = doc(firestore, 'users', email);
            if (image) {
                const imageResponse = await fetch(image.uri);
                const imageBlob = await imageResponse.blob();
                await uploadBytes(profileRef, imageBlob);
                getDownloadURL(profileRef)
                    .then(async url => {
                        await updateDoc(docRef, {
                            name: name,
                            surname: surname,
                            username: username,
                            birthdayDate: birthday,
                            street: street,
                            city: city,
                            postcode: postalCode,
                            image: {uri: url}
                        });
                    });
            } else {
                try {
                    await deleteObject(profileRef);
                } catch(err) {
                    console.log('Error when trying to delete the profile image ------');
                    console.log(err.message);
                }
                await updateDoc(docRef, {
                    name: name,
                    surname: surname,
                    username: username,
                    birthdayDate: birthday,
                    street: street,
                    city: city,
                    postcode: postalCode,
                    image: null
                });
            }
            dispatch(setUserDataAsync());
            dispatch(setUsersAsync());
            setVisibleSnackbar(true);
            setNameFocus(false);
            setLoading(false);
        }
    };

    const changePassword = _ => navigation.navigate('ChangePasswordAdmin');

    const {
        outerContainer,
        innerContainer,
        topLabel,
        softView,
        rowContainer,
        bottomButtonsContainer,
        btnContainer,
        bold
    } = styles;

    if (citiesStatus === 'loading' || loading)
        return <LoadingIndicator/>

    return (
        <View style={outerContainer}>
            <ScrollView
                contentContainerStyle={innerContainer}
                keyboardDismissMode='on-drag'
            >
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
                    autofocus={nameFocus}
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
                    <View style={rowContainer}>
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
                        onSubmitEditing={Keyboard.dismiss}
                        blurOnSubmit={false}
                    />
                </View>
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
                    editable={false}
                />
                <View style={[rowContainer, bottomButtonsContainer]}>
                    <View style={btnContainer}>
                        <AdminButton
                            text={'Mudar Palavra-Passe'}
                            onPress={changePassword}
                        />
                    </View>
                    <View style={btnContainer}>
                        <AdminButton 
                            text={'Salvar'}
                            onPress={onUpdate}
                        />
                    </View>
                </View>
            </ScrollView>
            <PickImageModal
                state={modalVisible}
                setState={setModalVisible}
                image={image}
                setImage={setImage}
            />
            <Snackbar
                visible={visibleSnackbar}
                onDismiss={() => setVisibleSnackbar(false)}
                duration={2000}
            >
                Salvo com sucesso!
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
        height: Dimensions.get('window').height * 1.3
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
    bottomButtonsContainer: {
        marginTop: 20,
        width: 390, 
        justifyContent: 'space-evenly'
    },
    btnContainer: {
        flex: 1, 
        margin: 10
    },
    bold: {
        fontWeight: 'bold'
    }
});

export default UserDetailsScreen;

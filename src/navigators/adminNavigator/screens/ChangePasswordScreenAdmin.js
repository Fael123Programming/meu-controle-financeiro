import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import Fonts from '../../../utils/Fonts';
import PasswordInput from '../../../components/PasswordInput';
import OkAlert from '../../../components/OkAlert';
import YesNoAlert from '../../../components/YesNoAlert';
import { validatePassword } from '../../../utils/Validator';
import { reauthenticate, updatePasswd } from '../../../../service';
import AdminButton from '../components/AdminButton';

const checkPassword = async password => {
    if (validatePassword(password)) 
        return await reauthenticate(password);
    return false;
}

const ChangePasswordScreenAdmin = ({navigation, authenticateFirst=true}) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [passwordInput, setPasswordInput] = useState();
    const [newPasswordInput, setNewPasswordInput] = useState();
    const [repeatPasswordInput, setRepeatPasswordInput] = useState();

    const [showChangePassword, setShowChangePassword] = useState(false);
    const [chances, setChances] = useState(3);
    const [editable, setEditable] = useState(true);

    const [errorAlertVisible, setErrorAlertVisible] = useState(false);
    const [errorAlertTitle, setErrorAlertTitle] = useState('');
    const [errorAlertDescription, setErrorAlertDescription] = useState('');

    const [successAlertVisible, setSuccessAlertVisible] = useState(false);

    const [warningAlertVisible, setWarningAlertVisible] = useState(false);
    const [action, setAction] = useState();

    useEffect(() => navigation.addListener('beforeRemove', e => {
        let action = e.data.action;
        if (action.type === 'POP' && showChangePassword) {
            e.preventDefault();
            setAction(action);
            setWarningAlertVisible(true);
        } 
    }), [navigation, showChangePassword]);

    useEffect(() => {
        if (!authenticateFirst)
            setShowChangePassword(true);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                keyboardDismissMode='on-drag'
                contentContainerStyle={styles.scrollView}
            >
                {
                    !showChangePassword && (
                        <View style={styles.innerContainer}>
                            <Text style={[styles.typePassword, Fonts.bodyLarge, { marginTop: '15%' }]}>Digite a palavra-passe atual</Text>
                            <PasswordInput
                                state={password}
                                setState={setPassword}
                                marginTop={2}
                                marginBottom={2}
                                editable={editable}
                                autofocus={true}
                                setRef={setPasswordInput}
                                backgroundColor={'white'}
                            />
                            <View style={{marginHorizontal: 7}}>
                                <AdminButton
                                    text={'Verificar'}
                                    onPress={async () => {
                                        if (await checkPassword(password)) {
                                            setShowChangePassword(true);
                                            setEditable(false);
                                        } else {
                                            if (!(chances - 1)) {
                                                setErrorAlertTitle('Palavra-passe Inválida');
                                                setErrorAlertDescription('Muitas tentativas foram feitas. Tente novamente mais tarde!');
                                                setErrorAlertVisible(true);
                                                setEditable(false);
                                            } else {
                                                setChances(chances - 1);
                                                setErrorAlertTitle('Palavra-passe Inválida');
                                                setErrorAlertDescription(`Você tem ${chances - 1} chance(s) restante(s)!`);
                                                setErrorAlertVisible(true);
                                            }
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    )
                }
                {
                    showChangePassword && (
                        <View>
                            <Text style={[styles.typePassword, Fonts.bodyLarge, { marginTop: '15%' }]}>Digite a nova palavra-passe</Text>
                            <PasswordInput
                                state={newPassword}
                                setState={setNewPassword}
                                marginTop={2}
                                marginBottom={2}
                                placeholder='Nova palavra-passe'
                                setRef={setNewPasswordInput}
                                blurOnSubmit={false}
                                autofocus={true}
                                onSubmitEditing={() => repeatPasswordInput.focus()}
                                backgroundColor={'white'}
                            />
                            <Text style={[styles.typePassword, Fonts.bodyLarge]}>Repita a nova palavra-passe</Text>
                            <PasswordInput
                                state={repeatPassword}
                                setState={setRepeatPassword}
                                marginTop={2}
                                marginBottom={2}
                                placeholder='Repita nova palavra-passe'
                                setRef={setRepeatPasswordInput}
                                backgroundColor={'white'}
                            />
                            <View style={{marginHorizontal: 7}}>
                                <AdminButton
                                    text={'Guardar'}
                                    onPress={async () => {
                                        if (validatePassword(newPassword)) {
                                            if (newPassword == repeatPassword) {
                                                await updatePasswd(newPassword);
                                                setSuccessAlertVisible(true);
                                            } else {
                                                setErrorAlertTitle('Mudança de Palavra-Passe');
                                                setErrorAlertDescription( 'Ambas as senhas devem ser iguais!');
                                                setErrorAlertVisible(true);
                                            }
                                        } else {
                                            setErrorAlertTitle('Mudança de Palavra-Passe');
                                            setErrorAlertDescription('A palavra-passe deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 caracter especial!');
                                            setErrorAlertVisible(true);
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    )
                }
            </ScrollView>
            <OkAlert
                visible={errorAlertVisible}
                setVisible={setErrorAlertVisible}
                description={errorAlertDescription}
                title={errorAlertTitle}
                onPressOk={() => {
                        setTimeout(() => {
                            setPassword('');
                            passwordInput.focus();
                        }, 100);
                    }
                }
            />
            <OkAlert
                visible={successAlertVisible}
                setVisible={setSuccessAlertVisible}
                description={'Sua palavra-passe foi atualizada com sucesso. Lembre-se de anotá-la em algum lugar para não esquecer!'}
                title={'Mudança de Palavra-Passe'}
                onPressOk={() => navigation.goBack()}
            />
            <YesNoAlert
                visible={warningAlertVisible}
                setVisible={setWarningAlertVisible}
                description={'Se voltar agora, perderá todos os dados inseridos. Deseja realmente fazer isso?'}
                title={'Alterar Palavra-Passe'}
                onPressYes={() => navigation.dispatch(action)}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerContainer: {
        alignSelf: 'flex-start', 
        marginLeft: '3.5%'
    },
    scrollView: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        // marginTop: '5%',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
    },
    typePassword: {
        alignSelf: 'flex-start',
        marginLeft: '2%',
    }
});

export default ChangePasswordScreenAdmin;

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import TextRow from './TextRow';
import YesNoAlert from '../../../components/YesNoAlert';
import { blockUserAsync } from '../../../../service';

const UserCard = props => {
    const [blocked, setBlocked] = useState(false);
    const [blockAlertVisible, setBlockAlertVisible] = useState(false);
    const [unblockAlertVisible, setUnblockAlertVisible] = useState(false);

    const { 
        id,
        name, 
        surname, 
        email,
        username,
    } = props.data;

    const { onPress } = props;
    
    const {
        pressable,
        idStyle,
    } = styles;

    return (
        <>
            <Pressable
                style={pressable}
                onPress={_ => onPress(props.data)}
                onLongPress={_ => {
                        if (blocked)
                            setUnblockAlertVisible(true);
                        else
                            setBlockAlertVisible(true);
                    }
                }
            >   
                { blocked ? (
                        <Entypo name="block" size={24} color="red"/>
                    ) : (
                        <View style={{margin: 12}}/>
                    )
                }
                <Text style={idStyle}>{id}</Text>
                <TextRow
                    label={'Nome'}
                    text={name}
                />
                <TextRow
                    label={'Apelido'}
                    text={surname}
                />
                <TextRow
                    label={'Nome de utilizador'}
                    text={username}
                />
                <TextRow
                    label={'E-mail'}
                    text={email}
                />
            </Pressable>
            <YesNoAlert
                visible={blockAlertVisible}
                setVisible={setBlockAlertVisible}
                title={'Bloquear Utilizador'}
                description={`Desejas realmente bloquear utilizador '${name}'?`}
                onPressYes={async () => {
                        setBlocked(true);
                        await blockUserAsync(email, true);
                    }
                }
                />
            <YesNoAlert
                visible={unblockAlertVisible}
                setVisible={setUnblockAlertVisible}
                title={'Desbloquear Utilizador'}
                description={`Desbloquear utilizador '${name}?'`}
                onPressYes={async () => {
                        setBlocked(false);
                        await blockUserAsync(email, false);
                    }
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    pressable: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 15,
        marginHorizontal: 30,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    },
    idStyle: {
        alignSelf: 'flex-end',
        fontWeight: 'bold'
    },
});

export default UserCard;

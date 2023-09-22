import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Modal,
    Dimensions
} from 'react-native';
import Fonts from '../../../utils/Fonts';

const Prompt = (
    {
        visible, 
        setVisible, 
        title, 
        description, 
        onPressCancel, 
        onPressConfirm, 
        text,
        setText, 
        onFocus=null,
        onBlur=null,
        secureTextEntry=false,
    }
) => {
    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={visible}
            onRequestClose={_ => setVisible(false)}
        >
            <Pressable
                style={styles.alertOuterPressable}
            >
                <View style={styles.alertContainer}>
                    <Text style={[styles.title, Fonts.headlineSmall]}>{title}</Text>
                    <Text style={[styles.description, Fonts.bodyLarge]}>{description}</Text>
                    <TextInput
                        defaultValue={text}
                        onChangeText={txt => setText(txt)}
                        secureTextEntry={secureTextEntry}
                        style={styles.promptInput}
                        onFocus={_ => onFocus && onFocus()}
                        onBlur={_ => onBlur && onBlur()}
                    />
                    <View style={styles.buttonContainer}>
                        <Pressable 
                            style={styles.alertButton}
                            onPress={() => {
                                    onPressCancel && onPressCancel();
                                    setVisible(false);
                                }
                            }
                        >
                            <Text style={{...Fonts.bodyLarge, color: 'red'}}>Cancelar</Text>
                        </Pressable>
                        <Pressable 
                            style={styles.alertButton}
                            onPress={() => {
                                    onPressConfirm && onPressConfirm();
                                    setVisible(false);
                                }
                            }
                        >
                            <Text style={{...Fonts.bodyLarge, color: 'green'}}>Confirmar</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    alertOuterPressable: {
        width: '100%', 
        height: '100%'
    },
    alertContainer: {
        position: 'absolute',
        left: '10%',
        top: '35%',
        width: .8 * Dimensions.get('window').width,
        backgroundColor: 'white',
        padding: 15,
        borderColor: 'black',
        borderWidth: .5
    },
    title: {
        margin: 5,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    description: {
        margin: 5,
        textAlign: 'left'
    },
    buttonContainer: {
        flex: 1,
        marginTop: '25%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    alertButton: {
        marginHorizontal: '5%'
    },
    promptInput: {
        width: 295,
        height: 45,
        padding: 5,
        backgroundColor: '#e3e3e3'
    }
});

export default Prompt;

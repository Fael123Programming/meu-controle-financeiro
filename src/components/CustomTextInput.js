import React from 'react';
import { 
    TextInput, 
    StyleSheet, 
    Dimensions
} from 'react-native';
import Colors from '../utils/Colors';

const CustomTextInput = (
    {
        state, 
        setState, 
        placeholder='', 
        width=90, 
        marginTop=2, 
        marginBottom=2, 
        keyboardType='ascii-capable', 
        hide=false, 
        autofocus=false,
        editable=true,
        maxLength=30,
        onSubmitEditing=null,
        blurOnSubmit=true,
        setRef=null,
        pullBack=false,
        backgroundColor=null,
        onFocus=null,
        onBlur=null
}) => {
    return ( 
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={'grey'}
            keyboardType={keyboardType}
            secureTextEntry={hide}
            defaultValue={state}
            editable={editable}
            style={
                [
                    styles.textInput, 
                    {
                        width: width / 100 * Dimensions.get('window').width, 
                        marginTop: marginTop / 100 * Dimensions.get('window').height, 
                        marginBottom: marginBottom / 100 * Dimensions.get('window').height
                    },
                    pullBack ? {zIndex: -10} : {},
                    backgroundColor ? {backgroundColor: backgroundColor} : {}
                ]
            }
            onChangeText={text => setState(text)}
            onSubmitEditing={onSubmitEditing}
            blurOnSubmit={blurOnSubmit}
            ref={setRef ? e => setRef(e) : null}
            autoFocus={autofocus}
            maxLength={maxLength}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: Colors.secondaryKeyColor,
        borderColor: Colors.onSecondaryKeyColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: '2%',
        marginHorizontal: '2%',
    }
});

export default CustomTextInput;

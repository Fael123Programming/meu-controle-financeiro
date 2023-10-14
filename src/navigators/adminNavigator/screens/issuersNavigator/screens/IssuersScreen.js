import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectIssuers, setIssuersAsync } from '../../../../../features/issuers/issuersSlice';
import { selectPaymentMethods, setPaymentMethodsAsync } from '../../../../../features/paymentMethods/paymentMethodsSlice';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import IssuerInput from '../../../components/IssuerInput';
import Fonts from '../../../../../utils/Fonts';
import AddButton from '../../../components/AddButton';
import { deleteIssuerAsync } from '../../../../../../service';

const IssuersScreen = ({route, navigation}) => {
    const [issuersState, setIssuersState] = useState([]);
    const [paymentMethodsState, setPaymentMethodsState] = useState([]);

    const issuers = useAppSelector(selectIssuers);
    const issuersStatus = useAppSelector(status => status.issuers.status);

    const paymentMethods = useAppSelector(selectPaymentMethods);
    const paymentMethodsStatus = useAppSelector(status => status.paymentMethods.status);

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(setIssuersAsync());
        dispatch(setPaymentMethodsAsync());
    }, []);

    useEffect(() => {
        if (issuers?.value)
            setIssuersState(issuers.value);
    }, [issuers]);

    useEffect(() => {
        if (paymentMethods?.value)
            setPaymentMethodsState(paymentMethods.value);
    }, [paymentMethods]);
    
    if (issuersStatus === 'loading' || paymentMethodsStatus === 'loading')
        return <LoadingIndicator/>
    
    const onDelete = async item => {
        await deleteIssuerAsync(item);
        onUpdate();
    };

    const onUpdate = _ => {
        dispatch(setIssuersAsync());
    };

    const renderItem = item => (
        <IssuerInput
            issuerData={item}
            options={paymentMethodsState}
            onDelete={onDelete}
            onUpdate={onUpdate}
            key={item.name + ' ' + item.defaultPaymentMethod}
        />
    );

    const {
        container,
        list,
        noDataStyle
    } = styles;
    
    return (
        <View style={container}>
            {
                issuersState.length > 0 ? (
                    <ScrollView
                        contentContainerStyle={list}
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                    >
                        { issuersState.map(ele => renderItem(ele)) }
                    </ScrollView>
                ) : (
                    <Text style={noDataStyle}>Sem Emissores</Text>
                )
            }
            <AddButton
                onPress={_ => {
                        navigation.navigate('CreateIssuer', {'paymentMethods': paymentMethodsState});
                    }
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        left: 330,
        top: 700,
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: '#fffff',
        borderWidth: .5
    },
    noDataStyle: {
        ...Fonts.headlineLarge,
        textAlign: 'center'
    }
});

export default IssuersScreen;

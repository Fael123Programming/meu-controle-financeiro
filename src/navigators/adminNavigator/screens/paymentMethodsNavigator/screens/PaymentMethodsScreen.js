import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectPaymentMethods, setPaymentMethodsAsync } from '../../../../../features/paymentMethods/paymentMethodsSlice';
import LoadingIndicator from '../../../../../components/LoadingIndicator';
import DeletableInput from '../../../components/CityDeletableInput';
import Fonts from '../../../../../utils/Fonts';
import AddButton from '../../../components/AddButton';

const PaymentMethodsScreen = ({route, navigation}) => {
    const [paymentMethodsState, setPaymentMethodsState] = useState([]);
    // const [paymentMethodsState, setPaymentMethodsState] = useState([
    //     {
    //         'label': 'MBWay',
    //         'value': 1
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 2
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 3
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 4
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 5
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 6
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 7
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 8
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 9
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 10
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 11
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 12
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 13
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 14
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 15
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 16
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 17
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 18
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 19
    //     },
    //     {
    //         'label': 'MBWay',
    //         'value': 20
    //     }
    // ]);
    const paymentMethods = useAppSelector(selectPaymentMethods);
    const paymentMethodsStatus = useAppSelector(status => status.paymentMethods.status);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(setPaymentMethodsAsync());
    }, []);

    useEffect(() => {
        if (paymentMethods?.value)
            setPaymentMethodsState(paymentMethods.value);
    }, [paymentMethods]);
    
    if (paymentMethodsStatus === 'loading')
        return <LoadingIndicator/>
    
    const onDelete = item => setPaymentMethodsState(paymentMethodsState.filter(paymentMethod => paymentMethod.label != item));

    const renderItem = item => <DeletableInput label={item.label} onDelete={onDelete} key={item.value}/>;

    const {
        container,
        list,
        addButton,
        noDataStyle
    } = styles;
    
    return (
        <View style={container}>
            {
                paymentMethodsState.length > 0 ? (
                    <ScrollView
                        contentContainerStyle={list}
                        keyboardDismissMode='on-drag'
                        showsVerticalScrollIndicator={false}
                    >
                        { paymentMethodsState.map(ele => renderItem(ele)) }
                    </ScrollView>
                ) : (
                    <Text style={noDataStyle}>Sem Métodos de Pagamento</Text>
                )
            }
            <AddButton
                onPress={_ => {
                        navigation.navigate('CreatePaymentMethod');
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

export default PaymentMethodsScreen;

import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { TextInput, } from 'react-native-paper';
import { map, size } from 'lodash';

import { colorMarca, colorBotonMiTienda, STRIPE_PUBLISHABLE_KEY, nombreApp } from '../Utils/colores';
import { formatoMoneda } from '../Utils/Utils';
import { obtenerUsuario } from '../Utils/Acciones';

const stripe = require('stripe-client')(STRIPE_PUBLISHABLE_KEY)
const stripePago = require('stripe')('sk_test_51JK6bxLLKx5TJk1FpEEGCrAO9EzJmZIFwsqUjuoyLWn52uIxDXPe850aJtFkhZY4fer6y9k8lnvgBdAjMHOa8SwB00fxK0v3yD')

export default function FormularioPago() {
    return (
        <>
            <View style={styles.contentCardView} >
                <Text style={styles.title} >Forma de pago</Text>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', }} >
                    <View style={styles.contentCard} >

                        <TextInput label='Nombre de la tarjeta' style={styles.input}
                            value={nombre}
                            onChangeText={(text) => setNombre(text)}
                        />

                        <TextInput label='Numero de la tarjeta' style={styles.input}
                            keyboardType='numeric'
                            value={numTarjeta}
                            onChangeText={(text) => setNumTarjeta(text)}
                        />

                        <View style={styles.containerInputs} >
                            <View style={styles.containerFecha} >
                                <TextInput label='Mes (MM)' style={styles.inputDate}
                                    value={mes}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setMes(text)}
                                />

                                <TextInput label='Año (YY)' style={styles.inputDate}
                                    value={año}
                                    keyboardType='numeric'
                                    onChangeText={(text) => setAño(text)}
                                />
                            </View>
                            <TextInput label='CW/CVC' style={styles.inputCvc}
                                value={numCvc}
                                keyboardType='numeric'
                                onChangeText={(text) => setNumCvc(text)}
                            />
                        </View>

                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={() => procesoPago()}>
                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }} >
                    <Text> Pagar ---- </Text>
                </View>
            </TouchableOpacity>
        </>

    )
}

const styles = StyleSheet.create({

    contentCardView: {
        marginTop: 10,
        width: '100%'
    },
    contentCard: {
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: colorMarca,
        padding: 5,
    },
    title: {
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    input: {
        width: '95%',
        margin: 5,
        height: 55,
    },
    containerInputs: {
        flexDirection: 'row',
        width: '95%',
        margin: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerFecha: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    inputDate: {
        width: 100,
        marginRight: 10,
        height: 55,
    },
    inputCvc: {
        width: '30%',
        height: 55,
    },
    btnContent: {
        paddingVertical: 4,
        //backgroundColor: '#00bb2d',
        backgroundColor: colorMarca,
        borderWidth: 2,
        borderColor: '#2874A6',
        height: 70,
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 20,
    }
})

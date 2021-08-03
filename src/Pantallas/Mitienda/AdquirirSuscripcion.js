import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, } from 'react-native-paper';
import { map, size } from 'lodash';

import { colorMarca, colorBotonMiTienda, STRIPE_PUBLISHABLE_KEY, } from '../../Utils/colores';
import { formatoMoneda } from '../../Utils/Utils';
import { obtenerUsuario } from '../../Utils/Acciones';

const stripe = require('stripe-client')(STRIPE_PUBLISHABLE_KEY)
//const stripePago = require('stripe')('sk_test_51JK6bxLLKx5TJk1FpEEGCrAO9EzJmZIFwsqUjuoyLWn52uIxDXPe850aJtFkhZY4fer6y9k8lnvgBdAjMHOa8SwB00fxK0v3yD')

const paquetes = [
    {
        clave: 'P1PV',
        cantidad: 1,
        vigencia: 7,
        precio: 30,
    },
    {
        clave: 'P4PV',
        cantidad: 4,
        vigencia: 7,
        precio: 110,
    },
    {
        clave: 'P8PV',
        cantidad: 8,
        vigencia: 7,
        precio: 210,
    },
    {
        clave: 'P10PV',
        cantidad: 10,
        vigencia: 7,
        precio: 250,
    },
    {
        clave: 'P15PV',
        cantidad: 15,
        vigencia: 7,
        precio: 350,
    },
    {
        clave: 'P28PV',
        cantidad: 28,
        vigencia: 7,
        precio: 600,
    },
]

export default function AdquirirSuscripcion() {

    const [clave, setClave] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState(0);
    const [numTarjeta, setNumTarjeta] = useState('');
    const [mes, setMes] = useState('');
    const [año, setAño] = useState('');
    const [numCvc, setNumCvc] = useState('');
    const [nombre, setNombre] = useState('');
    const [tokenStripe, setTokenStripe] = useState('');
    const infoUser = obtenerUsuario();
    const userUID = infoUser.uid;

    const crearAcuerdoPago = async () => {

        const result = await stripe.createToken({
            card: {
                number: numTarjeta,
                exp_month: mes,
                exp_year: año,
                cvc: numCvc,
                name: nombre
            }
        })

        if (result?.error) {
            switch (result.error.message) {
                case 'Your card number is incorrect.':
                    Alert.alert('Número de tarjeta incorrecto...')
                    break;
                case `Your card's expiration month is invalid.`:
                    Alert.alert('Mes de expiración de la tarjeta incorrecto...')
                    break;
                case `Your card's expiration year is invalid.`:
                    Alert.alert('Año de expiración de la tarjeta incorrecto...')
                    break;
                case `Your card's security code is invalid.`:
                    Alert.alert('Código de seguridad de la tarjeta incorrecto...')
                    break;
                case `Could not find payment information`:
                    Alert.alert('Todos los campos son requeridos...')
                    break;

                default:
                    break;
            }
        }

        if (result.id) {
            setTokenStripe(result.id)
            console.log(result.id)
        } else {
            console.log('No')
        }

    }

    const realizarPago = async () => {
        const charge = stripePago.charges.create({
            amount: precio * 100,
            currency: 'mxn',
            source: tokenStripe,
            description: `ID USER: ${userUID}`
        })
    }

    return (
        <ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                {map(paquetes, (paquete, index) => (
                    <TouchableOpacity style={styles.container} key={index} onPress={() => { setClave(paquete.clave), setCantidad(paquete.cantidad), setPrecio(paquete.precio) }} >
                        <View style={styles.content} >
                            <Text style={styles.titulo} >Clave: </Text>
                            <Text style={styles.subtitulo} >{paquete.clave}</Text>
                        </View>
                        <View style={styles.content} >
                            <Text style={styles.titulo} >Cantidad: </Text>
                            <Text style={styles.subtitulo} >{paquete.cantidad}</Text>
                            <Text style={styles.titulo} > publicacion(es)</Text>
                        </View>
                        <View style={styles.content} >
                            <Text style={styles.titulo} >Precio: </Text>
                            <Text style={styles.subtitulo} >{formatoMoneda(paquete.precio)}</Text>
                            <View>

                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

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

                <TouchableOpacity onPress={() => crearAcuerdoPago()}>
                    <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }} >
                        <Text> Pagar ---- </Text>
                    </View>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: colorMarca,
        width: '95%',
        marginTop: 10,
    },
    content: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingVertical: 2,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        color: colorMarca,
        fontWeight: 'bold'
    },
    subtitulo: {
        fontSize: 20,
        color: colorBotonMiTienda,
        fontWeight: 'bold'
    },
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

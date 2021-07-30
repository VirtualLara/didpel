import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, CheckBox, } from "react-native";
import { Input, Image, Button, Icon, Avatar, AirbnbRating } from 'react-native-elements';
import { map, size, filter, isEmpty, result, subtract } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment/min/moment-with-locales'

import Loading from '../../Componentes/Loading';
import { colorBotonMiTienda, colorMarca, textSemiAzul, textWarning } from '../../Utils/colores';
import { cargarImagen, sumarDias } from '../../Utils/Utils';
import { subirImagenesBatch, addRegistro, obtenerUsuario } from '../../Utils/Acciones';

export default function AgregarVacante() {

    const [titulo, seTtitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario] = useState(0);
    const [colonia, setColonia] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [errores, setErrores] = useState({});
    const [loading, setLoading] = useState(false);
    const [seleccion, setSeleccion] = useState(true);

    const navigation = useNavigation();
    moment.locale('es');

    const validarStatus = () => {
        if (seleccion) {
            return 1;
        } else {
            return 0;
        }
    }

    function formatoMoneda(num) {
        return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const vigenciaDias = (val) => {

        let numDias = sumarDias(new Date(), val)

        return numDias;

    }

    const addVacante = async () => {
        setErrores({});

        if (isEmpty(titulo)) {
            setErrores({ titulo: "El campo titulo es obligatorio." })
        } else if (isEmpty(descripcion)) {
            setErrores({ descripcion: "El campo descripción es obligatorio." })
        } else if (!salario > 0) {
            setErrores({ salario: "Introduzca un precio para el producto." })
        } else if (isEmpty(colonia)) {
            setErrores({ colonia: "El campo colonia es obligatorio." })
        } else if (isEmpty(ciudad)) {
            setErrores({ ciudad: "El campo ciudad es obligatorio." })
        } else {
            setLoading(true)
            const empleo = {
                titulo,
                descripcion,
                salario,
                colonia,
                ciudad,
                usuario: obtenerUsuario().uid,
                status: validarStatus(),
                fechacreacion: moment(new Date()).format("MMM Do YY"),
                fechavigencia: moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
            }

            const registrarOfertaEmpleo = await addRegistro('Vacantes', empleo);

            if (registrarOfertaEmpleo.statusresponse) {
                setLoading(false)
                Alert.alert('Registro Exitoso',
                    'La oferta de empleo se registro de forma correcta',
                    [
                        {
                            styles: 'cancel',
                            text: 'Aceptar',
                            onPress: () => {
                                navigation.goBack(),
                                    navigation.navigate('Vacantes')
                            }
                        }
                    ]
                )
            } else {
                setLoading(false)
                Alert.alert('Registro Fallido',
                    'Ha ocurrido un error al registrar la oferta de empleo',
                    [
                        {
                            styles: 'cancel',
                            text: 'Aceptar',
                        }
                    ]
                )
            }
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.container} >
            <View style={styles.line} />

            <Input
                placeholder='Título'
                onChangeText={(text) => seTtitulo(text)}
                inputStyle={styles.input}
                errorMessage={errores.titulo}
            />
            <Input
                placeholder='Descripción'
                onChangeText={(text) => setDescripcion(text)}
                inputStyle={styles.textArea}
                errorMessage={errores.descripcion}
                multiline={true}
            />
            <Input
                placeholder='Salario'
                onChangeText={(text) => setSalario(text)}
                inputStyle={styles.input}
                errorMessage={errores.salario}
                keyboardType='number-pad'
            />
            <Input
                placeholder='Colonia donde se publica'
                onChangeText={(text) => setColonia(text)}
                inputStyle={styles.input}
                errorMessage={errores.colonia}
            />
            <Input
                placeholder='Ciudad donde se publica'
                onChangeText={(text) => setCiudad(text)}
                inputStyle={styles.input}
                errorMessage={errores.ciudad}
            />

            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                <Text style={styles.txtLabelWarning} > Hacer pública esta oferta </Text>
                <CheckBox
                    style={styles.checkbox}
                    value={seleccion}
                    onValueChange={() => {
                        if (seleccion) {
                            Alert.alert(
                                '¡Advertencia!',
                                'Esta acción marcara la publicación como inactiva y ya no se mostrara a posibles candidatos.',
                                [
                                    {
                                        text: 'Cancelar',
                                        style: 'Cancel',
                                    },
                                    {
                                        text: 'Continuar',
                                        onPress: () => {
                                            setSeleccion(false);
                                        }
                                    }
                                ]
                            )
                        } else {
                            Alert.alert(
                                '¡Advertencia!',
                                'Esta acción marcara la publicación activa y será mostrada a posibles candidatos.',
                                [
                                    {
                                        text: 'Cancelar',
                                        style: 'Cancel',
                                    },
                                    {
                                        text: 'Continuar',
                                        onPress: () => {
                                            setSeleccion(true);
                                        }
                                    }
                                ]
                            )
                        }
                    }

                    }
                />
            </View> */}

            <Button
                title='Publicar Oferta de Empleo'
                buttonStyle={styles.btnAddNew}
                onPress={() => {
                    Alert.alert(
                        '¡Rectificar informacíon!',
                        'Por favor rectifique la información que esta a punto de publicar, ya que una vez publicada no podrá modificarse. Esta publicación tiene vigencia de 3 días. ¿Desea continuar?',
                        [
                            {
                                text: 'Cancelar',
                                style: 'Cancel',
                            },
                            {
                                text: 'Continuar',
                                onPress: () => {
                                    addVacante();
                                }
                            }
                        ]
                    )
                }
                }
            />

            <Loading isVisible={loading} text='Favor de esperar...' />

        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 50,
        margin: 5,
        padding: 5,
        elevation: 3,
    },
    line: {
        borderBottomColor: colorBotonMiTienda,
        borderBottomWidth: 2,
        width: 100,
        marginTop: 20,
        alignSelf: 'center'
    },
    input: {
        width: '90%',
        borderRadius: 10,
        borderColor: '#707070',
        marginTop: 5,
        paddingHorizontal: 20,
        height: 50,
    },
    textArea: {
        width: '90%',
        borderRadius: 10,
        borderColor: '#707070',
        marginTop: 5,
        paddingHorizontal: 20,
        height: 150
    },
    txtLabel: {
        fontSize: 20,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: 'bold',
        color: textSemiAzul,
    },
    btnAddNew: {
        backgroundColor: colorMarca,
        marginTop: 20,
        marginBottom: 50,
        marginHorizontal: 20,
    },
    txtLabelWarning: {
        fontSize: 20,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: 'bold',
        color: textWarning,
        backgroundColor: "#000"
    }
})
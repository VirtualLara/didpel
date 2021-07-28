import React, { useState, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { size, } from 'lodash';

import { listarVacantesMiCiudad, } from '../../Utils/Acciones';
import { formatoMoneda, } from '../../Utils/Utils';
import { colorMarca, colorBotonMiTienda, } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';
import Loading from '../../Componentes/Loading';

export default function VacantesMiCiudad() {

    const navigation = useNavigation();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [mensajes, setMensajes] = useState('No hay vacantes  disponibles en este momento en tu colonia ...' +
        ' o NO HAS REGISTRADO TU CIUDAD');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            (async () => {
                setList(await listarVacantesMiCiudad());
            })()
            setLoading(false);
        }, [])
    );

    const actualizarVacantes = async () => {
        setLoading(true);
        setList(await listarVacantesMiCiudad());
        setLoading(false);
    }

    function Vacante(props) {
        const { vacante, navigation } = props;
        const { titulo, descripcion, salario, colonia, ciudad, usuario, id } = vacante.item;

        return (

            <TouchableOpacity
                style={styles.card}
                onPress={() => { navigation.navigate('DetallesVancate', { id, titulo, descripcion, salario, colonia, ciudad }) }}
            >
                <View style={styles.card}            >
                    <View style={styles.infoBox} >

                        <Text style={styles.titulo} >{titulo}</Text>
                        <Text >{descripcion}</Text>
                        <Text > <Text style={styles.titulo} >Colonia: </Text>{colonia}</Text>
                        <Text > <Text style={styles.titulo} >Ciudad: </Text>{ciudad}</Text>

                        <View style={{ flexDirection: 'row' }} >
                            <Text style={styles.tituloSalario} ><Text style={styles.titulo} >Salario ofrecido: </Text> {formatoMoneda(parseInt(salario))} </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.frame} >
            <StatusBar backgroundColor={colorMarca} />

            <View style={styles.header} >
                <Busqueda
                    setList={setList}
                    actualizar={actualizarVacantes}
                    setSearch={setSearch}
                    search={search}
                    setMensajes={setMensajes}
                    placeholder={'Buscar actvidad - oficio - colonia - ciudad'}
                    query={`SELECT * FROM Vacantes WHERE titulo LIKE '${search}%' OR descripcion LIKE '${search}%' OR colonia LIKE '${search}%' OR ciudad LIKE '${search}%'`}
                />
            </View>
            {size(list) > 0 ? (
                <FlatList
                    data={list}
                    renderItem={(vacante) => (
                        <View style={{ paddingTop: 10 }} >
                            <Vacante vacante={vacante} navigation={navigation} />
                        </View>
                    )}
                    keyExtractor={(Item, index) => index.toString()}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: colorBotonMiTienda, textAlign: 'center' }} > {mensajes} </Text>
                </View>
            )
            }

            <Loading isVisible={loading} text='Cargando...' />

        </View>
    )
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        height: '10%',
        width: '100%',
        backgroundColor: colorMarca,
        alignContent: 'center',
        justifyContent: 'center'
    },

    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
    },
    card: {
        width: '100%',
        flex: 1,
        borderBottomColor: colorMarca,
        borderBottomWidth: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    infoBox: {
        width: '100%',
        paddingLeft: 10,
        //alignItems: 'center',
        flex: 1,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colorMarca,
    },
    tituloSalario: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colorBotonMiTienda,
    },
    publicadaPor: {
        fontSize: 18,
        marginTop: 5,
        color: colorBotonMiTienda,
        fontWeight: 'bold'
    },
    avatarBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 5,
    },
    avatar: {
        width: 30,
        height: 30,
    },
    displayName: {
        fontSize: 18
    },
    precio: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colorMarca,
        alignSelf: 'center'
    },
})
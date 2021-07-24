import React, { useState, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, FlatList, Linking } from "react-native";
import { Icon, Avatar, } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { size, upperCase } from 'lodash';

import { listarVacantes, obtenerUsuario, } from '../../Utils/Acciones';
import { formatoMoneda, enviarMensajeWhastapp } from '../../Utils/Utils';
import { colorMarca, colorBotonMiTienda } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';
import Loading from '../../Componentes/Loading';

export default function Vacantes() {

    const navigation = useNavigation();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [mensajes, setMensajes] = useState('No hay vacantes  disponibles en este momento...');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            (async () => {
                setList(await listarVacantes());
            })()
            setLoading(false);
        }, [])
    );

    const actualizarVacantes = async () => {
        setLoading(true);
        setList(await listarVacantes());
        setLoading(false);
    }

    function Vacante(props) {
        const { vacante } = props;
        const { titulo, descripcion, salario, colonia, ciudad, usuario, fechacreacion, fechavigencia } = vacante.item;
        const { displayName, photoURL, phoneNumber } = usuario;

        return (
            <View style={styles.card}            >
                <View style={styles.infoBox} >

                    <Text style={styles.titulo} >{titulo}</Text>
                    <Text >{descripcion}</Text>
                    <Text > <Text style={styles.titulo} >Para: </Text>{colonia}</Text>
                    <Text > <Text style={styles.titulo} >En: </Text>{ciudad}</Text>

                    <View style={{ flexDirection: 'row' }} >
                        <Text style={styles.tituloSalario} ><Text style={styles.titulo} >Salario ofrecido: </Text> {formatoMoneda(parseInt(salario))} </Text>
                    </View>

                    <Text style={styles.publicadaPor} >Publicada por:</Text>

                    <View style={styles.avatarBox} >
                        <Avatar
                            source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                            rounded
                            size='large'
                            style={styles.avatar}
                        />
                        <Text style={styles.displayName} > {displayName} </Text>
                        <Text>      </Text>
                        <Icon
                            type='material-community'
                            name='whatsapp'
                            color={colorBotonMiTienda}
                            size={40}
                            onPress={() => {
                                let mensaje = `Estimad@, me interesa la vancante de ${upperCase(titulo)} publicada en la aplicación DIDPEL. Me puede brindar más informes por favor.`;
                                enviarMensajeWhastapp(phoneNumber, mensaje)
                            }}
                            iconStyle={{ position: 'relative', }}
                        />
                    </View>



                </View>
            </View>
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
                    placeholder={'Buscar por actvidad u oficio'}
                    query={`SELECT * FROM Vacantes WHERE titulo LIKE '${search}%' OR descripcion LIKE '${search}%'`}
                />
            </View>

            {size(list) > 0 ? (
                <FlatList
                    data={list}
                    renderItem={(vacante) => (
                        <Vacante vacante={vacante} navigation={navigation} />
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
        paddingVertical: 20,
        flex: 1,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderBottomColor: colorMarca,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imgProducto: {
        width: 150,
        height: 200,
        borderRadius: 10,
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

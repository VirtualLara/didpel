import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Icon, Avatar, Image, Rating, Badge } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { size, upperCase } from 'lodash';

import { colorBotonMiTienda, colorMarca, nombreApp } from '../../Utils/colores';
import { listarProductosPorAnunciante, obtenerUsuario } from '../../Utils/Acciones';
import { formatoMoneda, enviarMensajeWhastapp } from '../../Utils/Utils';
import Loading from '../../Componentes/Loading';
import Modal from '../../Componentes/Modal';

export default function PublicacionesPorAnunciante(props) {

    const { route } = props;
    console.log(route.params)

    const navigation = useNavigation();
    const [list, setList] = useState([]);
    const [mensajes, setMensajes] = useState('Cargando...');
    const [categoria, setCategoria] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const usuarioActual = obtenerUsuario();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setList(await listarProductosPorAnunciante());
            })()
        }, [])
    );

    function Producto(props) {
        const { producto, navigation } = props;
        const { titulo, descripcion, precio, imagenes, rating, id, usuario, } = producto.item;
        const { displayName, photoURL, phoneNumber } = usuario;

        return (
            <View style={styles.card}            >
                <View>
                    <Image source={{ uri: imagenes[0] }} style={styles.imgProducto} />
                    <Text style={styles.precio} > {formatoMoneda(parseInt(precio))} </Text>
                </View>
                <View style={styles.infoBox} >
                    <Text style={styles.titulo} >{titulo}</Text>
                    <Text style={{ width: '90%', fontSize: 14 }} > {size(descripcion) > 100 ? `${descripcion.substring(0, 100)}...` : descripcion}</Text>

                    <Text style={styles.vendidoPor} >Vendido por:</Text>
                    <View style={styles.avatarBox} >
                        <Avatar
                            source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                            rounded
                            size='large'
                            style={styles.avatar}
                        />
                        <Text style={styles.displayName} > {size(displayName) > 15 ? `${displayName.substring(0, 15)}...` : displayName}</Text>
                    </View>

                    <Rating
                        imageSize={25}
                        startingValue={rating}
                        readonly
                    />
                    <View style={styles.boxInterno}>
                        {/*  <Icon
                            type="material-community"
                            name="message-text-outline"
                            color={colorBotonMiTienda}
                            size={50}
                            onPress={() => {
                                setIsVisible(true);
                            }}
                        /> */}

                        <Icon
                            type="material-community"
                            name="whatsapp"
                            color={colorBotonMiTienda}
                            size={50}
                            onPress={() => {
                                const mensajeWhat = `Estimad@ ${displayName}, mi nombre es ${usuarioActual.displayName}, me interesa el producto ${upperCase(titulo)} que se encuentra publicado en la aplicación ${nombreApp}.`;
                                enviarMensajeWhastapp(phoneNumber, mensajeWhat);
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }



    if (size(list) > 0) {
        return (
            <View style={styles.frame} >
                <StatusBar backgroundColor={colorMarca} />

                <View style={styles.categoriaView} >
                    <View style={styles.tituloCategoria} >
                        {categoria.length > 0 && (
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Icon
                                    type='material-community'
                                    color='red'
                                    name='close'
                                    reverse
                                    size={10}
                                />
                                <Text style={{ color: '#fff', fontWeight: 'bold', backgroundColor: 'red' }} > Limpiar Filtro </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {
                        size(list) > 0 ? (
                            <FlatList
                                data={list}
                                renderItem={(producto) => (
                                    <Producto producto={producto} navigation={navigation} />
                                )}
                                keyExtractor={(Item, index) => index.toString()}
                            />
                        ) : (
                            <Text> {mensajes} </Text>
                        )
                    }

                </View>

            </View >
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <ActivityIndicator
                    size={50}
                    color={colorBotonMiTienda}
                />

                <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold' }} >Obteniendo información...</Text>
            </View>
        )
    }

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
        paddingLeft: 10,
        alignItems: 'center',
        flex: 1,
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        color: colorMarca,
    },
    vendidoPor: {
        fontSize: 16,
        marginTop: 5,
        color: colorMarca,
        fontWeight: '700'
    },
    avatarBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    avatar: {
        width: 30,
        height: 30,
    },
    displayName: {

    },
    precio: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: colorMarca,
        alignSelf: 'center'
    },
    categoriaHover: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 7.0,
            height: -8.0,
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        backgroundColor: colorBotonMiTienda,
        borderRadius: 40,
        elevation: 1
    },
    categoriaBtn: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 7.0,
            height: -8.0,
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        backgroundColor: '#fff',
        borderRadius: 40,
        elevation: 1
    },
    txtHover: {
        fontSize: 12,
        fontStyle: 'italic',
        color: "#fff"
    },
    txt: {
        fontSize: 12,
        color: colorMarca,
    },
    categoriaView: {
        marginTop: 10,
    },
    tituloCategoria: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tituloTxt: {
        color: colorMarca,
        fontSize: 14,
        fontWeight: 'bold'
    },
    categoriasList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingTop: 5
    },
    boxInterno: {
        width: 150,
        justifyContent: "space-around",
        flexDirection: "row",
    },
})
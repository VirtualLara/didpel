import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Icon, Avatar, Image, Rating, Badge } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { size } from 'lodash';

import { colorBotonMiTienda, colorMarca } from '../../Utils/colores';
import { listarProductos, obtenerUsuario, listarProductosPorCategoria } from '../../Utils/Acciones';
import { formatoMoneda } from '../../Utils/Utils';
import Busqueda from '../../Componentes/Busqueda';
import Loading from '../../Componentes/Loading';

export default function Tienda() {

    const navigation = useNavigation();
    const { photoURL } = obtenerUsuario();
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const [mensajes, setMensajes] = useState('Cargando...');
    const [notificaciones, setNotificaciones] = useState(0);
    const [categoria, setCategoria] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setProductList(await listarProductos());
            })()
        }, [])
    );

    const cargarFiltroPorCategoria = async (categoria) => {

        setLoading(true);

        const listaProductosCategoria = await listarProductosPorCategoria(categoria);
        setProductList(listaProductosCategoria);

        if (listaProductosCategoria.length === 0) {
            setMensajes('No se encontraron datos para la categoría ' + categoria)
        }

        setLoading(false);

    }

    const actualizarProductos = async () => {
        setLoading(true);
        setProductList(await listarProductos());
        setLoading(false);
    }

    function Producto(props) {
        const { producto, navigation } = props;
        const { titulo, descripcion, precio, imagenes, rating, id, usuario, } = producto.item;
        const { displayName, photoURL } = usuario;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => { navigation.navigate('Detalle', { id, titulo }) }}
            >
                <Image source={{ uri: imagenes[0] }} style={styles.imgProducto} />
                <View style={styles.infoBox} >
                    <Text style={styles.titulo} >{titulo}</Text>
                    <Text >{descripcion.substring(0, 50)}</Text>
                    <Text style={styles.vendidoPor} >Vendido por:</Text>
                    <View style={styles.avatarBox} >
                        <Avatar
                            source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                            rounded
                            size='large'
                            style={styles.avatar}
                        />
                        <Text style={styles.displayName} > {displayName} </Text>
                    </View>

                    <Rating
                        imageSize={15}
                        startingValue={rating}
                        style={{ paddingLeft: 40 }}
                        readonly
                    />
                    <Text style={styles.precio} > {formatoMoneda(parseInt(precio))} </Text>
                </View>
            </TouchableOpacity>
        )
    }

    function BotonCategoria(props) {

        const { categoriaBoton, categoria, icon, texto, setCategoria, cargarFiltroPorCategoria, } = props;

        return (
            <TouchableOpacity
                style={categoria === categoriaBoton ? styles.categoriaHover : styles.categoriaBtn}
                onPress={() => {
                    setCategoria(categoriaBoton)
                    cargarFiltroPorCategoria(categoriaBoton)
                }}
            >
                <Icon
                    type='material-community'
                    name={icon}
                    size={30}
                    color={categoria === categoriaBoton ? '#fff' : colorMarca}
                />
                <Text style={categoria === categoriaBoton ? styles.txtHover : styles.txt} > {texto} </Text>
            </TouchableOpacity>
        )

    }



    return (
        <View style={styles.frame} >
            <StatusBar backgroundColor={colorMarca} />

            <Loading isVisible={loading} text='Cargando...' />

            <View style={styles.header} >
                <KeyboardAwareScrollView>
                    <View style={styles.menu} >
                        <Avatar
                            rounded
                            size='medium'
                            source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                        />

                        <Image source={require('../../../assets/logo.png')} style={styles.logo}
                        />

                        <View>
                            <Icon
                                type='material-community'
                                name='bell-outline'
                                color='#fff'
                                size={30}
                                onPress={() => { Alert.alert('Apenas estan programandome..') }}
                            />
                            <Badge
                                status='error'
                                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                value={2}
                            />
                        </View>

                    </View>

                    <Busqueda
                        setProductList={setProductList}
                        actualizarProductos={actualizarProductos}
                        setSearch={setSearch}
                        search={search}
                        setMensajes={setMensajes}
                    />

                </KeyboardAwareScrollView>

            </View>

            <View style={styles.categoriaView} >
                <View style={styles.tituloCategoria} >
                    <Text style={styles.tituloTxt} > - CATEGORIAS - </Text>
                    {categoria.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setCategoria('');
                                actualizarProductos();
                            }
                            }
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

                <View style={styles.categoriasList} >
                    <BotonCategoria
                        categoriaBoton='articulos'
                        categoria={categoria}
                        icon='cart-arrow-down'
                        texto='Artículos'
                        setCategoria={setCategoria}
                        cargarFiltroPorCategoria={cargarFiltroPorCategoria}
                    />
                    <BotonCategoria
                        categoriaBoton='servicios'
                        categoria={categoria}
                        icon='lightbulb-on-outline'
                        texto='Servicios'
                        setCategoria={setCategoria}
                        cargarFiltroPorCategoria={cargarFiltroPorCategoria}
                    />
                    <BotonCategoria
                        categoriaBoton='profesionales'
                        categoria={categoria}
                        icon='account-cash'
                        texto='Serv. Prof...'
                        setCategoria={setCategoria}
                        cargarFiltroPorCategoria={cargarFiltroPorCategoria}
                    />
                    <BotonCategoria
                        categoriaBoton='otros'
                        categoria={categoria}
                        icon='silverware-fork-knife'
                        texto='Otros'
                        setCategoria={setCategoria}
                        cargarFiltroPorCategoria={cargarFiltroPorCategoria}
                    />
                </View>
            </View>



            {
                size(productList) > 0 ? (
                    <FlatList
                        data={productList}
                        renderItem={(producto) => (
                            <Producto producto={producto} navigation={navigation} />
                        )}
                        keyExtractor={(Item, index) => index.toString()}
                    />
                ) : (
                    <Text> {mensajes} </Text>
                )
            }


        </View >
    );
}


const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        height: '20%',
        width: '100%',
        backgroundColor: colorMarca,
    },
    menu: {
        marginTop: 20,
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
    }
})
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, } from '@react-navigation/native';
import { Avatar, Icon } from 'react-native-elements';
import { size, map } from 'lodash';

import { colorBotonMiTienda, colorMarca } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';
import Loading from '../../Componentes/Loading';

import { listarAnunciantesMiColonia } from '../../Utils/Acciones';


export default function DirectorioMiColonia() {

    const [list, setList] = useState('');
    const [search, setSearch] = useState('');
    const [mensajes, setMensajes] = useState('No hay publicaciones en tu ciudad ' +
        '' +
        'O AUN NO REGISTRAS TU CIUDAD...');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setList(await listarAnunciantesMiColonia())
            })()
            console.log(list)
        }, [])
    )

    const actualizarlist = async () => {
        setLoading(true);
        setList(await listarAnunciantesMiColonia());
        setLoading(false);
    }

    return (
        <View style={styles.frame} >
            <StatusBar backgroundColor={colorMarca} />

            <View style={styles.header} >

                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }} >
                    <Icon
                        type='material-community'
                        name='menu'
                        color='#fff'
                        size={50}
                        onPress={() => { navigation.openDrawer() }}
                    />
                </View>

                <View style={{ width: '90%' }}>
                    <Busqueda
                        setList={setList}
                        actualizar={actualizarlist}
                        setSearch={setSearch}
                        search={search}
                        setMensajes={setMensajes}
                        placeholder={'Buscar por nombre de anunciante'}
                        query={`SELECT * FROM Usuarios WHERE displayName LIKE '${search}%'`}
                    />
                </View>
            </View>

            {
                size(list) > 0 ? (
                    <FlatList
                        data={list}
                        renderItem={(anunciante) => (
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }} >
                                <TouchableOpacity onPress={() => { navigation.navigate('PublicacionesPorAnunciante', { anunciante }) }}>
                                    <AnuncianteData photoURL={anunciante.item.photoURL} displayName={anunciante.item.displayName} colonia={anunciante.item.colonia} />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(Item, index) => index.toString()}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: colorBotonMiTienda, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }} > {mensajes} </Text>
                    </View>
                )
            }

            <Loading isVisible={loading} text='Cargando...' />

        </View>
    )
}

const AnuncianteData = (props) => {

    const { photoURL, displayName, colonia } = props;
    console.log(props)

    return (
        <View style={{ width: '95%', height: 100, borderWidth: 1, borderColor: colorMarca, borderRadius: 40, paddingTop: 5 }} >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: '100%', }} >
                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} >
                    <Avatar
                        source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                        rounded
                        size='large'
                        style={styles.avatar}
                    />
                </View>

                <View style={{ width: '80%' }} >
                    <Text style={{ fontSize: 20, color: colorMarca, fontWeight: 'bold', paddingLeft: 18, }} >Empresa - Anunciante: </Text>
                    <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold', paddingLeft: 18, }} >{displayName}</Text>

                    <View style={{ width: '80%', flexDirection: 'row' }} >
                        <Text style={{ fontSize: 20, color: colorMarca, fontWeight: 'bold', paddingLeft: 18, }} >Col. </Text>
                        <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold', paddingLeft: 18, }} >{colonia}</Text>
                    </View>

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: '11%',
        width: '100%',
        backgroundColor: colorMarca,
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    avatar: {
        width: 60,
        height: 60,
    },
})

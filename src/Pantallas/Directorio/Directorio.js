import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect, } from '@react-navigation/native';
import { Avatar, } from 'react-native-elements';
import { size, map } from 'lodash';

import { colorBotonMiTienda, colorMarca } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';

import { listarAnunciantes } from '../../Utils/Acciones';


export default function Directorio() {

    const [anunciantes, setAnunciantes] = useState('');
    const [cargando, setCargando] = useState('');

    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setAnunciantes(await listarAnunciantes())
            })()
            console.log(anunciantes)
        }, [])
    )


    return (
        <View style={styles.frame} >
            <StatusBar backgroundColor={colorMarca} />

            <View style={styles.header} >
                <Busqueda
                    /*   setProductList={setProductList}
                      actualizarProductos={actualizarProductos}
                      setSearch={setSearch}
                      search={search}
                      setMensajes={setMensajes} */
                    placeholder={'Buscar por nombre de anunciante'}
                />
            </View>

            <ScrollView>

                {map(anunciantes, (anunciante) => (
                    <>
                    <TouchableOpacity onPress={() => { navigation.navigate('PublicacionesPorAnunciante', { anunciante }) }} key={anunciante.id} >
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }} >
                            <AnuncianteData photoURL={anunciante.photoURL} displayName={anunciante.displayName} />
                        </View>
                    </TouchableOpacity>
                    </>
                ))}

            </ScrollView>

        </View>
    )
}

const AnuncianteData = (props) => {

    const { photoURL, displayName } = props;

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
        height: '10%',
        width: '100%',
        backgroundColor: colorMarca,
        alignContent: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 60,
        height: 60,
    },
})

import React from 'react';
import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import { Avatar, } from 'react-native-elements';

import { colorBotonMiTienda, colorMarca } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';


export default function DirectorioMiCiudad() {
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
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <AnuncianteData />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <AnuncianteData />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <AnuncianteData />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                    <AnuncianteData />
                </View>
            </ScrollView>

        </View>
    )
}

const AnuncianteData = () => {
    return (
        <View style={{ width: '95%', height: 100, borderWidth: 1, borderColor: colorMarca, borderRadius: 40, paddingTop: 5 }} >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', height: '100%', }} >
                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }} >
                    <Avatar
                        source={require('../../../assets/personasprueba.jpg')}
                        rounded
                        size='large'
                        style={styles.avatar}
                    />
                </View>

                <View style={{ width: '80%' }} >
                    <Text style={{ fontSize: 20, color: colorMarca, fontWeight: 'bold', paddingLeft: 20, }} > Empresa - Anunciante: </Text>
                    <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold', paddingLeft: 20, }} > Nombre de la empresa o persona anunciante... </Text>
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

import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import { colorMarca } from '../../Utils/colores';
import Busqueda from '../../Componentes/Busqueda';

export default function Vacantes() {
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
                        placeholder={'Buscar por actvidad u oficio'}
                    />
                </View>
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
})

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { colorMarca, colorBotonMiTienda } from '../../Utils/colores';
import { formatoMoneda } from '../../Utils/Utils';

export default function AdquirirSuscripcion() {
    return (
        <ScrollView>
            <View style={styles.container} >
                <View style={styles.content} >
                    <Text style={styles.titulo} >Cantidad: </Text>
                    <Text style={styles.subtitulo} >1</Text>
                    <Text style={styles.titulo} > publicacion(es)</Text>
                </View>
                <View style={styles.content} >
                    <Text style={styles.titulo} >Vigencia: </Text>
                    <Text style={styles.subtitulo} >7</Text>
                    <Text style={styles.titulo} > días</Text>
                </View>
                <View style={styles.content} >
                    <Text style={styles.titulo} >Precio: </Text>
                    <Text style={styles.subtitulo} >{formatoMoneda(30)}</Text>
                </View>
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
})

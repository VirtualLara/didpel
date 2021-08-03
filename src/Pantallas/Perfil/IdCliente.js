
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { obtenerUsuario } from '../../Utils/Acciones';
import { colorMarca } from '../../Utils/colores';

import Barcode from "react-native-barcode-builder";

export default function IdCliente() {

    const [id, setId] = useState('');

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const usuario = await obtenerUsuario();
                setId(usuario.uid)
            })()
        }, [])
    )

    if (id) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Barcode value={id} format='CODE128' text={id} width={1} />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <ActivityIndicator size={100} color={colorMarca} />
                <Text style={{ color: colorMarca, fontSize: 20, fontWeight: 'bold' }} >Cargando...</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})

import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Icon, Avatar, } from 'react-native-elements';
import { size, upperCase } from 'lodash';

import { enviarMensajeWhastapp, formatoMoneda } from '../../Utils/Utils';
import { nombreApp, colorMarca, colorBotonMiTienda } from '../../Utils/colores';
import { obtenerRegistroXID, } from '../../Utils/Acciones';



export default function DetallesVancate(props) {

    const { route } = props
    const { id, titulo, descripcion, salario, colonia, ciudad } = route.params

    const [vacante, setVacante] = useState('');
    const [nombreVendedor, setNombreVendedor] = useState('');
    const [photoVendedor, setPhotoVendedor] = useState('');
    const [phoneVendedor, setPhoneVendedor] = useState('');

    useEffect(() => {
        (async () => {
            setVacante((await obtenerRegistroXID("Vacantes", id)).data);
        })();
    }, []);

    console.log(vacante)

    useEffect(() => {
        (async () => {
            if (size(vacante) > 0) {
                const resultado = (
                    await obtenerRegistroXID("Usuarios", vacante.usuario)
                ).data;
                setNombreVendedor(resultado.displayName);
                setPhotoVendedor(resultado.photoURL);
                setPhoneVendedor(resultado.phoneNumber);
            }
        })();
    }, [vacante]);

    return (
        <ScrollView style={styles.frame} >
            <View style={styles.infoBox} >
                <Text style={styles.titulo} >{titulo}</Text>
                <Text>{'\n'}</Text>
                <Text style={{ fontSize: 16, textAlign: 'justify' }} >{descripcion}</Text>
                <Text>{'\n'}</Text>
                <Text ><Text style={styles.titulo} >Colonia: </Text>{colonia}</Text>
                <Text ><Text style={styles.titulo} >Ciudad: </Text>{ciudad}</Text>
                <View style={{ flexDirection: 'row' }} >
                    <Text style={styles.tituloSalario} ><Text style={styles.titulo} >Salario ofrecido: </Text> {formatoMoneda(parseInt(salario))} </Text>
                </View>

                <Text>{'\n'}</Text>
                <Text style={styles.publicadaPor} >Publicada por:</Text>
                <View style={styles.avatarBox} >
                    <Avatar
                        source={photoVendedor ? { uri: photoVendedor } : require('../../../assets/avatar.jpg')}
                        rounded
                        size='large'
                        style={styles.avatar}
                    />
                    <Text style={styles.displayName} > {nombreVendedor} </Text>
                    <Text>      </Text>
                    <Icon
                        type='material-community'
                        name='whatsapp'
                        color={colorBotonMiTienda}
                        size={40}
                        onPress={() => {
                            let mensaje = `Estimad@, ${nombreVendedor} me interesa la vancante de ${upperCase(titulo)} publicada en la aplicación ${nombreApp}. Me puede brindar más informes por favor.`;
                            enviarMensajeWhastapp(phoneVendedor, mensaje)
                        }}
                        iconStyle={{ position: 'relative', }}
                    />
                </View>
            </View>
        </ScrollView>


    )
}


const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: '#fff',
    },
    infoBox: {
        width: '100%',
        paddingLeft: 10,
        paddingTop: 20,
        flex: 1,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colorMarca,
    },
    tituloSalario: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colorBotonMiTienda,
    },
    publicadaPor: {
        fontSize: 20,
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
        width: 50,
        height: 50,
    },
    displayName: {
        fontSize: 18
    },
})

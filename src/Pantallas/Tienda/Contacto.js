import React, { } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
import { colorBotonMiTienda, colorMarca, nombreApp, } from "../../Utils/colores";

import { enviarMensajeWhastapp } from '../../Utils/Utils';

export default function Contacto(props) {

  const { route } = props;
  const { displayName, phoneNumber, photoURL, email, mensaje, productotitulo } = route.params;

  const mensajeNoti = `Hola *${displayName}*. Te escribo desde *${nombreApp}*, me dejaste un mensaje acerca de mi publicación *${productotitulo}*, dime en que te puedo apoyar.`

  return (
    <View style={styles.container} >

      <View style={styles.panel} >
        <Avatar
          size="large"
          source={
            photoURL
              ? { uri: photoURL }
              : require("../../../assets/avatar.jpg")
          }
          style={styles.avatar}
          rounded
        />

        <View style={{ marginLeft: 5 }} >
          <Text style={styles.text} >{displayName}</Text>
          <Text style={styles.text}  >{email}</Text>
        </View>

      </View>

      <View style={{ alignContent: 'center', flexDirection: 'row', width: '100%', paddingTop: 10, paddingBottom: 10 }} >
        <Text style={{ fontSize: 20, fontWeight: 'bold', width: '25%' }} >Mensaje:  </Text>
        <Text style={{ fontSize: 20, fontWeight: '500', width: '65%' }} >{mensaje}</Text>
      </View>

      <View style={styles.rowIcon} >
        <Icon
          type='material-community'
          name='whatsapp'
          reverse
          size={30}
          color={colorBotonMiTienda}
          onPress={() => { enviarMensajeWhastapp(phoneNumber, mensajeNoti) }}
        />

        {<Icon
          type='material-community'
          name='phone-in-talk'
          reverse
          size={30}
          color={colorBotonMiTienda}
          onPress={() => { Linking.openURL(`tel:${phoneNumber}`) }}
        />}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  panel: {
    backgroundColor: colorMarca,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 20
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#fff'
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
})

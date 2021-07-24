import React, { } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
import { colorBotonMiTienda, colorMarca, nombreApp, } from "../../Utils/colores";

import { enviarMensajeWhastapp } from '../../Utils/Utils';

export default function Contacto(props) {

  const { route } = props;
  const { displayName, phoneNumber, photoURL, email } = route.params;

  const mensaje = `Hola ${displayName}. Te escribo desde ${nombreApp}, me dejaste un mensaje acerca de una de mis publicaciones.`

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

      <View style={styles.rowIcon} >
        <Icon
          type='material-community'
          name='whatsapp'
          reverse
          size={30}
          color={colorBotonMiTienda}
          onPress={() => { enviarMensajeWhastapp(phoneNumber, mensaje) }}
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

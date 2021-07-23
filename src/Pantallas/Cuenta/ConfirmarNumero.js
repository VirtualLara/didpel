import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import CodeInput from 'react-native-confirmation-code-input';
import { useNavigation } from '@react-navigation/native';
import { colorMarca } from '../../Utils/colores';

import Loading from '../../Componentes/Loading';
import { confirmarCodigo, obtenerToken, obtenerUsuario, addRegisterEspecifico, } from '../../Utils/Acciones';

export default function ConfirmarNumero(props) {

  const { route } = props;
  const { verificationId } = route.params;
  const [loading, setLoading] = useState(false);

  const confirmarCodigoSMS = async (code) => {

    const resultado = await confirmarCodigo(verificationId, code);

    if (resultado) {
      setLoading(true);
      const token = await obtenerToken();
      const { uid, displayName, photoURL, email, phoneNumber, } = obtenerUsuario();
      const registro = await addRegisterEspecifico("Usuarios", uid, {
        token,
        displayName,
        photoURL,
        email,
        phoneNumber,
        fechaCreacion: new Date(),
        colonia: '',
        ciudad: '',
        ocupacion: '',
        publicacionesCompradas: 4,
        publicacionesRealizadas: 0,
        publicacionesRestantes: 4,
        permiso: true,
      })
      setLoading(false)
    } else {
      setLoading(false)
      Alert.alert(
        'Error de contenido...',
        'Favor de validad el código ...',
        [
          {
            style: 'default',
            text: 'Entendido'
          }
        ]
      )
    }


  }

  return (
    <View style={styles.container} >
      <Image source={require('../../../assets/logo.png')} style={styles.imgeLogo} />
      <Text style={styles.text} >Favor de revisar el SMS recibido e introducir el código de verificación.</Text>
      <CodeInput
        activeColor='#fff'
        inactiveColor='#fff'
        autofocus={true}
        inputPosition='center'
        size={50}
        codeLength={6}
        //secureTextEntry
        keyboardType="numeric"
        containerStyle={{ marginTop: 30 }}
        codeInputStyle={{ borderWidth: 1.5 }}
        onFulfill={(code) => {
          confirmarCodigoSMS(code)
        }}
      />
      <Loading isVisible={loading} text='Favor de esperar...' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorMarca,
    paddingHorizontal: 20,
  },
  imgeLogo: {
    width: 106,
    height: 106,
    alignSelf: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#fff",
    marginVertical: 20
  }
})
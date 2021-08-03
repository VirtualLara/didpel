import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import { Button } from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colorMarca, colorBotonMiTienda } from '../../Utils/colores';

import FirebaseRecaptcha from '../../Utils/FirebaseRecaptcha';
import { enviarAutenticacionPhone } from '../../Utils/Acciones';

export default function EnviarConfirmacion() {

  const [country, setCountry] = useState('MX');
  const [callingCode, setCallingCode] = useState('52');
  const [phone, setPhone] = useState(null);
  const recaptchaVerifier = useRef();
  const inputPhone = useRef();
  const navigation = useNavigation();

  const enviarConfirmar = async () => {
    if (!isEmpty(phone)) {
      const numero = `+${callingCode}${phone}`
      const verificationId = await enviarAutenticacionPhone(numero, recaptchaVerifier);

      if (!isEmpty(verificationId)) {
        navigation.navigate('ConfirmarNumero', { verificationId });
      } else {
        Alert.alert(
          "Verificación",
          "Introduzca un número válido",
          [
            {
              style: 'Cancel',
              text: "Entendido",
              onPress: () => {
                inputPhone.current.clear();
                inputPhone.current.focus();
              }
            }
          ]
        )
      }
    }
  }

  return (
    <View style={styles.container} >
      <Image source={require('../../../assets/logo.png')} style={styles.imglogo} />

      <View style={styles.panel} >

        <View style={{ borderBottomColor: colorBotonMiTienda, borderWidth: 2, width: 100 }} />

        <View style={styles.panelInterno} >

          <Icon name='whatsapp' type='material-community' size={100} color={colorBotonMiTienda} />

          <Text style={styles.titulo} >Ingresar número WhatsApp</Text>

          <View style={styles.viewPhone} >
            <CountryPicker
              withFlag
              withCallingCode
              withFilter
              withCallingCodeButton
              countryCode={country}
              onSelect={(Country) => {
                setCountry(Country.cca2);
                setCallingCode(...Country.callingCode);
              }}
            />
            <Text style={{ color: '#fff', fontWeight: 'bold' }} > | </Text>
            <TextInput
              placeholder='Número de WhatsApp'
              style={styles.imput}
              placeholderTextColor='#fff'
              fontWeight='bold'
              keyboardType='number-pad'
              onChangeText={(text) => { setPhone(text) }}
              value={phone}
              ref={inputPhone}
            />
          </View>

          <Button
            title='Confirmar número'
            buttonStyle={{ backgroundColor: colorBotonMiTienda, marginHorizontal: 20, }}
            containerStyle={{ marginVertical: 20, width: '100%', }}
            onPress={() => enviarConfirmar()}
          />
        </View>

      </View>

      <FirebaseRecaptcha referencia={recaptchaVerifier} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorMarca
  },
  imglogo: {
    width: '90%',
    height: 106,
    marginVertical: 40,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: 'center',
  },
  panelInterno: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    width: '80%',
  },
  titulo: {
    fontSize: 16,
    textAlign: 'center',
    color: colorBotonMiTienda,
    fontWeight: 'bold'
  },
  viewPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    width: '100%',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(37, 211,106, 0.6)'
  },
  imput: {
    width: '80%',
    height: '100%',
    marginLeft: 5,
  },
})

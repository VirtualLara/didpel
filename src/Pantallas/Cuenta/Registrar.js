import React, { useRef } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import Toast from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import RegisterForm from '../../Componentes/RegisterForm';
import { colorMarca } from '../../Utils/colores';

export default function Registrar() {

  const toastRef = useRef();

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container} >
        <StatusBar backgroundColor={colorMarca} />
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.imgLogo}
        />
        <Text style={styles.textoBaner} > Crear Cuenta </Text>
        <RegisterForm toastRef={toastRef} />
        <Toast ref={toastRef} position='center' opacity={0.9} />
      </View>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorMarca,
  },
  imgLogo: {
    width: '90%',
    height: 106,
    marginTop: 40,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  textoBaner: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    alignSelf: 'center'
  }
})
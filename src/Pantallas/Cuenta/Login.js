import React, { useRef } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../../Componentes/LoginForm';
import Toast from 'react-native-easy-toast';

import { colorMarca } from '../../Utils/colores';


export default function Login() {

  const toastRef = useRef();

  return (
    <View style={styles.container} >
      <StatusBar backgroundColor={colorMarca} />
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.imgLogo}
      />
      <Text style={styles.textoBaner} >¡Bienvenido!</Text>
      <LoginForm toastRef={toastRef} />
      <Toast ref={toastRef} position='center' opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorMarca,
  },
  imgLogo: {
    width: 106,
    height: 106,
    marginTop: 40,
    alignSelf: 'center',
  },
  textoBaner: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    alignSelf: 'center'
  }
})
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Input, Button, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { validaremail } from '../Utils/Utils';
import { isEmpty, size } from 'lodash';
import * as firebase from 'firebase';
import { colorMarca, colorBotonMiTienda } from '../Utils/colores';

import { validarSesion } from '../Utils/Acciones';
import Loading from '../Componentes/Loading';

export default function RegisterForm(props) {

  const navigation = useNavigation();
  const { toastRef } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function crearCuenta() {
    if (isEmpty(email) || isEmpty(password) || isEmpty(repeatPassword)) {
      toastRef.current.show('Todos los campos son obligatorios');
    } else if (!validaremail(email)) {
      toastRef.current.show('Correo no válido');
    } else if (password !== repeatPassword) {
      toastRef.current.show('Las contraseñas deben ser iguales');
    } else if (size(password) < 6) {
      toastRef.current.show('Las contraseñas deben tener al menos 6 caracteres')
    } else {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((respose, userCredential) => {
          let user = userCredential.user;
          console.log(user)
          setLoading(false);
          toastRef.current.show('Registro exitoso...');
        })
        .catch((err) => {
          setLoading(false);
          toastRef.current.show('Error al intentar registrar o quiza el usuario ya esta registrado...')
        })
    }
  }

  return (
    <View style={styles.container} >

      <View style={{ borderBottomColor: colorBotonMiTienda, borderBottomWidth: 2, width: 100 }} />

      <Input placeholder='Correo'
        containerStyle={styles.input}
        rightIcon={{ type: 'material-community', name: 'at', color: colorMarca, }}
        leftIcon={{ type: 'material-community', name: 'account-circle-outline', color: colorMarca, }}
        onChangeText={(text) => { setEmail(text) }}
        value={email}
      />

      <Input placeholder='Contraseña'
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: show ? 'eye-off-outline' : 'eye-outline',
          color: colorMarca,
          onPress: () => setShow(!show),
        }}
        leftIcon={{ type: 'material-community', name: 'security', color: colorMarca, }}
        onChangeText={(text) => { setPassword(text) }}
        value={password}
        secureTextEntry={!show}
      />

      <Input placeholder='Repetir Contraseña'
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: show ? 'eye-off-outline' : 'eye-outline',
          color: colorMarca,
          onPress: () => setShow(!show),
        }}
        leftIcon={{ type: 'material-community', name: 'security', color: colorMarca, }}
        onChangeText={(text) => { setRepeatPassword(text) }}
        value={repeatPassword}
        secureTextEntry={!show}
      />

      <Button title='CREAR CUENTA'
        containerStyle={styles.btnEntrar}
        buttonStyle={{ backgroundColor: colorBotonMiTienda }}
        onPress={() => crearCuenta()}
      />

      <Button title='INICIAR SESION'
        containerStyle={styles.btnEntrar}
        buttonStyle={{ backgroundColor: colorMarca }}
        onPress={() => navigation.goBack()}
      />

      <Loading isVisible={loading} text='espere por favor' />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f6f8',
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    paddingTop: 20,
  },
  input: {
    width: "90%",
    marginTop: 20,
    height: 50,
  },
  btnEntrar: {
    width: '90%',
    marginTop: 20
  },
})
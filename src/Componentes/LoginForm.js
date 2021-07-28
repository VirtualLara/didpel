import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Input, Button, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { validaremail } from '../Utils/Utils';
import { isEmpty } from 'lodash';
import * as firebase from 'firebase';
import { colorMarca, colorBotonMiTienda } from '../Utils/colores';

import Loading from '../Componentes/Loading';

export default function LoginForm(props) {

  const { toastRef } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const iniciarSesion = () => {
    if (isEmpty(email) || isEmpty(password)) {
      toastRef.current.show('Debe llenar todos los campos...');
    } else if (!validaremail(email)) {
      toastRef.current.show('Debe ingresar un correo válido...');
    } else {

      setLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          setLoading(false);
          toastRef.current.show('Ha iniciado sesión exitosamente...')
        })
        .catch((err) => {
          setLoading(false);
          toastRef.current.show('Ha ocurrido un error al intentar iniciar sesión...')
        })
    }
  }

  return (
    <View style={styles.container} >

      <View style={{ borderBottomColor: colorBotonMiTienda, borderBottomWidth: 2, width: 100 }} />

      <Input placeholder='Correo'
        containerStyle={styles.input}
        rightIcon={{ type: 'material-community', name: 'at', color: colorMarca, onPress: () => alert('hola'), }}
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

      <Button title='ENTRAR'
        containerStyle={styles.btnEntrar}
        buttonStyle={{ backgroundColor: colorBotonMiTienda }}
        onPress={() => iniciarSesion()}
      />

      <Text style={styles.txtCrearCuenta}> ¿No tienes cuenta?
        <Text>    </Text>
        <Text style={styles.txtCuenta} cuenta onPress={() => navigation.navigate('Registrar')} >
          Crear Cuenta
        </Text>
      </Text>

      <Divider style={{ backgroundColor: '', height: 1, width: "90%", marginTop: 20, }} />

      <Text style={styles.txtO}> O </Text>

      <View style={styles.btnLogin}>
        <TouchableOpacity style={styles.btnGoogle} >
          <Icon
            size={24}
            type='material-community'
            name='google'
            color='#fff'
            backgroundColor='transparent'
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnFacebook} >
          <Icon
            size={24}
            type='material-community'
            name='facebook'
            color='#fff'
            backgroundColor='transparent'
          />
        </TouchableOpacity>
      </View>

      <Loading isVisible={loading} text='Facor de esperar...' />

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
  txtCrearCuenta: {
    marginTop: 20,
    fontSize: 18,
  },
  txtCuenta: {
    color: colorBotonMiTienda,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold'
  },
  txtO: {
    color: colorMarca,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
  btnLogin: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: "100%",
  },
  btnGoogle: {
    backgroundColor: '#db4a39',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
  },
  btnFacebook: {
    backgroundColor: '#3b5998',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
  },
})
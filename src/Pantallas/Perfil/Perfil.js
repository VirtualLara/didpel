import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Icon, Avatar, Input } from 'react-native-elements';
import CodeInput from 'react-native-confirmation-code-input';
import FirebaseRecaptcha from '../../Utils/FirebaseRecaptcha';

import { colorBotonMiTienda, colorMarca, contrasteColorMarca } from '../../Utils/colores';
import { cargarImagen, validaremail } from '../../Utils/Utils';
import {
  subirImagenesBatch, obtenerUsuario, addRegisterEspecifico,
  actualizarPerfil, enviarAutenticacionPhone, reautenticar, actualizarEmailFirebase, actualizarTelefono, obtenerRegistroXID
} from '../../Utils/Acciones';

import Loading from '../../Componentes/Loading';
import InputEditable from '../../Componentes/InputEditable';
import Modal from '../../Componentes/Modal';

export default function Perfil(props) {

  const [imagenPerfil, setImagenPerfil] = useState('');
  const [loading, setLoading] = useState(false);

  const usuario = obtenerUsuario();
  const { uid } = usuario;

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [colonia, setColonia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [ocupacion, setOcupacion] = useState('');

  const [editableName, setEditableName] = useState(false);
  const [editableEmail, setEditableEmail] = useState(false);
  const [editablePhone, setEditablePhone] = useState(false);
  const [editableColonia, setEditableColonia] = useState(false);
  const [editableCiudad, setEditableCiudad] = useState(false);
  const [editableOcupacion, setEditableOcupacion] = useState(false);

  const [verificationId, setVerificationId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [updatePhone, setUpdatePhone] = useState(false);

  const recaptcha = useRef();


  useFocusEffect(
    useCallback(() => {
      (async () => {
        const info = await obtenerRegistroXID('Usuarios', uid)
        const { photoURL, displayName, phoneNumber, email, colonia, ciudad, ocupacion } = info.data;
        setImagenPerfil(photoURL);
        setDisplayName(displayName);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        setColonia(colonia);
        setCiudad(ciudad);
        setOcupacion(ocupacion);
      })()
    }, [])
  );

  const onChangeInput = (input, valor) => {
    switch (input) {
      case 'displayName': {
        setDisplayName(valor);
      }
        break;
      case 'email': {
        setEmail(valor);
      }
        break;
      case 'phoneNumber': {
        setPhoneNumber(valor);
      }
        break;
      case 'colonia': {
        setColonia(valor);
      }
        break;
      case 'ciudad': {
        setCiudad(valor);
      }
        break;
      case 'ocupacion': {
        setOcupacion(valor);
      }
        break;
    }
  }

  const obtenerValor = (input) => {
    switch (input) {
      case 'displayName': {
        return displayName;
      }
        break;
      case 'email': {
        return email;
      }
        break;
      case 'phoneNumber': {
        return phoneNumber;
      }
        break;
      case 'colonia': {
        return colonia;
      }
        break;
      case 'ciudad': {
        return ciudad;
      }
        break;
      case 'ocupacion': {
        return ocupacion;
      }
        break;
    }
  }

  const actualizarValor = async (input, valor) => {
    switch (input) {
      case 'displayName':
        actualizarPerfil({ displayName: valor });
        addRegisterEspecifico('Usuarios', usuario.uid, { displayName: valor })
        break;

      case 'email':
        if (valor !== usuario.email) {
          if (validaremail(valor)) {
            const verification = await enviarAutenticacionPhone(phoneNumber, recaptcha);
            if (verification) {
              setVerificationId(verification);
              setUpdatePhone(true);
              setIsVisible(true);
            } else {
              alert('Ha ocurrido un error en la verificación');
              setEmail(usuario.email);
            }
          }
        }
        break;

      case 'phoneNumber':
        if (valor !== usuario.phoneNumber) {
          const verification = await enviarAutenticacionPhone(phoneNumber, recaptcha);

          if (verification) {
            setVerificationId(verification);
            setUpdatePhone(true);
            setIsVisible(true);
          } else {
            alert('Ha ocurrido un error en la verificación');
            setEmail(usuario.phoneNumber);
          }
        }
        break;

      case 'colonia':
        actualizarPerfil({ colonia: valor });
        addRegisterEspecifico('Usuarios', usuario.uid, { colonia: valor })
        break;

      case 'ciudad':
        actualizarPerfil({ ciudad: valor });
        addRegisterEspecifico('Usuarios', usuario.uid, { ciudad: valor })
        break;

      case 'ocupacion':
        actualizarPerfil({ ocupacion: valor });
        addRegisterEspecifico('Usuarios', usuario.uid, { ocupacion: valor })
        break;
    }
  }

  const keyboardType = (valor) => {
    let teclado = valor
    return teclado;
  }

  const ConfirmarCodigo = async (verificationId, code) => {
    setLoading(true);

    if (updatePhone) {
      const telefono = await actualizarTelefono(verificationId, code);
      const updateRegistro = await addRegisterEspecifico('Usuarios', usuario.uid, { phoneNumber: phoneNumber });
      setUpdatePhone(false);
      setLoading(false);
      setIsVisible(false);
    } else {

      const resultado = await reautenticar(verificationId, code);

      if (resultado.statusresponse) {
        const emailResponse = await actualizarEmailFirebase(email);
        const updateTegistro = await addRegisterEspecifico('Usuarios', usuario.uid, { email: email });
        setLoading(false);
        setIsVisible(false);

      } else {
        alert('Ha ocurrido un error al actualizar el correo');
        setLoading(false);
        setIsVisible(false);
      }
    }

  }

  function ModalVerification(props) {
    const { isVisible, setIsVisible, ConfirmarCodigo, verificationId } = props;
    return (
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} >
        <View style={styles.confirmacion} >
          <Text style={styles.titulo} >Confirmar Código</Text>
          <Text style={styles.detalle} >Se ha enviado un Código de verificación a su número de teléfono</Text>
          <CodeInput
            secureTextEntry
            activeColor={colorMarca}
            inactiveColor={colorMarca}
            autoFocus={false}
            inputPosition='center'
            size={40}
            containerStyle={{ marginTop: 30 }}
            codeInputStyle={{ borderWidth: 1.5 }}
            codeLength={6}
            keyboardType='number-pad'
            onFulfill={(code) => {
              ConfirmarCodigo(verificationId, code);
            }}
          />
        </View>
      </Modal>
    )

  }


  return (
    <View>
      <StatusBar backgroundColor={colorMarca} />
      <ScrollView>
        <Cabecera />
        <HeaderAvatar
          usuario={usuario}
          imagenPerfil={imagenPerfil}
          setImagenPerfil={setImagenPerfil}
          setLoading={setLoading}
        />
        <FormData
          onChangeInput={onChangeInput}
          obtenerValor={obtenerValor}
          editableName={editableName}
          editableEmail={editableEmail}
          editablePhone={editablePhone}
          editableCiudad={editableCiudad}
          editableColonia={editableColonia}
          editableOcupacion={editableOcupacion}
          setEditableName={setEditableName}
          setEditableEmail={setEditableEmail}
          setEditablePhone={setEditablePhone}
          setEditableCiudad={setEditableCiudad}
          setEditableColonia={setEditableColonia}
          setEditableOcupacion={setEditableOcupacion}
          actualizarValor={actualizarValor}
          keyboardType={keyboardType}
        />
        <ModalVerification
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          verificationId={verificationId}
          ConfirmarCodigo={ConfirmarCodigo}
        />
        <FirebaseRecaptcha referencia={recaptcha} />
        <Loading isVisible={loading} text='Favor de esperar...' />
      </ScrollView>
    </View>
  );
}

function Cabecera() {
  return (
    <View>
      <View style={styles.bg} >
        <Text style={{ color: "#fff", fontSize: 30, fontWeight: 'bold' }} >Mi perfil</Text>
      </View>
    </View>
  )
}

function HeaderAvatar(props) {
  const { usuario, setImagenPerfil, imagenPerfil, setLoading } = props;
  const { uid } = usuario;

  const cambiarFoto = async () => {
    const resultado = await cargarImagen([1, 1]);

    if (resultado.status) {
      setLoading(true)
      const url = await subirImagenesBatch([resultado.imagen], "Perfil");
      const update = await actualizarPerfil({ photoURL: url[0] })
      const response = await addRegisterEspecifico('Usuarios', uid, { photoURL: url[0] })

      if (response.statusresponse) {
        setImagenPerfil(url[0]);
        setLoading(false);
      } else {
        alert('Ha ocurrido un error al actualizar la foto de perfirl...');
        setLoading(false);
      }

    }

  }

  return (
    <View style={styles.avatarInline} >
      <Avatar
        source={imagenPerfil ? { uri: imagenPerfil } : require('../../../assets/avatar.jpg')}
        style={styles.avatar}
        size='xlarge'
        rounded
        borderWidth={3}
        borderColor='#fff'
        borderRadius={100}
      />
      <Avatar.Accessory
        style={{ width: 35, height: 35, borderRadius: 100, marginRight: 120, backgroundColor: colorBotonMiTienda, borderWidth: 2, borderColor: '#fff' }}
        onPress={cambiarFoto}
      />
    </View>
  )
}

function FormData(props) {

  const {
    obtenerValor,
    onChangeInput,
    editableName, editableEmail, editablePhone, editableColonia, editableCiudad, editableOcupacion,
    setEditableName, setEditableEmail, setEditablePhone, setEditableColonia, setEditableCiudad, setEditableOcupacion,
    actualizarValor,
    keyboardType, } = props;

  return (
    <View>
      <InputEditable
        id='displayName'
        label='Nombre'
        obtenerValor={obtenerValor}
        placeholder='Nombre'
        onChangeInput={onChangeInput}
        editable={editableName}
        setEditable={setEditableName}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('default')}
      />

      <InputEditable
        id='email'
        label='Correo'
        obtenerValor={obtenerValor}
        placeholder='ejemplo@ejemplo.com'
        onChangeInput={onChangeInput}
        editable={editableEmail}
        setEditable={setEditableEmail}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('default')}
      />

      <InputEditable
        id='phoneNumber'
        label='Teléfono'
        obtenerValor={obtenerValor}
        placeholder='+000000000000'
        onChangeInput={onChangeInput}
        editable={editablePhone}
        setEditable={setEditablePhone}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('number-pad')}
      />

      <InputEditable
        id='colonia'
        label='Colonia'
        obtenerValor={obtenerValor}
        placeholder='Colonia'
        onChangeInput={onChangeInput}
        editable={editableColonia}
        setEditable={setEditableColonia}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('default')}
      />

      <InputEditable
        id='ciudad'
        label='Ciudad'
        obtenerValor={obtenerValor}
        placeholder='Ciudad'
        onChangeInput={onChangeInput}
        editable={editableCiudad}
        setEditable={setEditableCiudad}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('default')}
      />

      <InputEditable
        id='ocupacion'
        label='Ocupacion'
        obtenerValor={obtenerValor}
        placeholder='Ocupacion'
        onChangeInput={onChangeInput}
        editable={editableOcupacion}
        setEditable={setEditableOcupacion}
        actualizarValor={actualizarValor}
        keyboardType={keyboardType('default')}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    //height: 2000,
    height: 150,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    backgroundColor: contrasteColorMarca,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInline: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -70,
  },
  avatar: {
    width: 110,
    height: 110,
  },
  confirmacion: {
    height: 200,
    width: '100%',
    alignItems: 'center',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20
  },
  detalle: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center'
  },
})
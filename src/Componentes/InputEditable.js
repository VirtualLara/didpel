import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';

import { colorMarca, colorBotonMiTienda } from '../Utils/colores';

export default function InputEditable(props) {

  const { label, placeholder, obtenerValor, onChangeInput, id, editable, setEditable, actualizarValor, keyboardType } = props;

  const [habilitar, setHabilitar] = useState(false);

  const editar = () => {
    setEditable(!editable);
    setHabilitar(true);
  }

  const guardar = () => {
    setEditable(!editable);
    setHabilitar(false);
  }

  return (
    <View style={styles.input} >
      <Text style={styles.label} > {label} </Text>
      <View style={styles.row} >
        <TextInput
          key={id}
          placeholder={placeholder}
          value={obtenerValor(id)}
          onChangeText={(text) => { onChangeInput(id, text) }}
          style={styles.TextInputInterno}
          editable={habilitar}
          keyboardType={keyboardType}
        />
        {
          editable ? (
            <Icon name='content-save'
              type='material-community'
              size={20}
              onPress={() => {
                actualizarValor(id, obtenerValor(id));
                guardar();
              }}
              color={colorBotonMiTienda}
              reverse
            />
          ) : (
            <Icon name='pencil'
              type='material-community'
              size={16}
              onPress={editar}
              color={colorMarca}
              reverse
            />
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //paddingBottom: 10
  },
  label: {
    fontWeight: 'bold',
    //marginBottom: 10,
    color: colorMarca,
    fontSize: 16
  },
  TextInputInterno: {
    fontSize: 20,
    width: '80%',
  },
  input: {
    borderBottomColor: '#cecece',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
})

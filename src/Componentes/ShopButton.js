import React from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { colorBotonMiTienda } from '../Utils/colores';

export default function ShopButton() {
  const navigation = useNavigation();

  return (
    <TouchableHighlight style={styles.container}
      onPress={() => {
        navigation.navigate('MiTienda')
      }}
    >
      <Icon name='store' color='#fff' size={40} />
    </TouchableHighlight>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colorBotonMiTienda,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 35,
    top: -5,
    shadowRadius: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 0.3,
    borderWidth: 3,
    borderColor: '#fff',
  }
})
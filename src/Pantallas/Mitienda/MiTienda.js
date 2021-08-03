import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, FlatList, Image } from "react-native";
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { colorMarca, colorBotonMiTienda } from '../../Utils/colores';
import { listarMisProductos, actualizarRegistro, eliminarProducto, obtenerRegistroXID, obtenerUsuario } from '../../Utils/Acciones';
import { formatoMoneda } from '../../Utils/Utils';
import { Alert } from "react-native";

export default function MiTienda() {

  const [productos, setProductos] = useState({});
  const [datosUser, setDatosUser] = useState(null);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setProductos(await listarMisProductos())
        setDatosUser(await obtenerRegistroXID('Usuarios', obtenerUsuario().uid))
      })()
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center' }} >
      <StatusBar backgroundColor={colorMarca} />

      {productos.length > 0 ? (
        <FlatList
          data={productos}
          renderItem={(item) => (
            <Producto
              producto={item}
              setProductos={setProductos}
              navigation={navigation}
            />
          )}
        />
      ) : (
        <View style={{ alignSelf: 'center' }} >
          <View style={{ width: 120, height: 120, borderColor: colorBotonMiTienda, borderWidth: 1, borderRadius: 60, alignSelf: 'center' }} >
            <Icon
              type='material-community'
              name='cart-plus'
              size={100}
              color={colorBotonMiTienda}
              style={{ margin: 10 }}
            />
          </View>
        </View>
      )}
      <Icon
        name='plus'
        type='material-community'
        color={colorMarca}
        containerStyle={styles.containerBtn}
        onPress={() => {
          if (datosUser.data.publicacionesRestantes > 0) {
            navigation.navigate('AgregarProducto')
          } else {
            Alert.alert('Publicaciones agotadas',
              'Debe adquirir una suscripción para seguir publicando.',
              [
                {
                  text: 'Entendido',
                  style: 'Cancel',
                }
              ]
            )
          }
        }}
        reverse
      />
      <Icon
        name='cart-plus'
        type='material-community'
        color={colorBotonMiTienda}
        containerStyle={styles.containerBtnSuscription}
        onPress={() => { navigation.navigate('AdquirirSuscripcion') }}
        reverse
      />
    </View>
  );
}

function Producto(props) {

  const { producto, setProductos, navigation } = props;
  const { descripcion, precio, id, imagenes, titulo, status } = producto.item;

  return (
    <View style={styles.container} >
      <Image
        source={{ uri: imagenes[0] }}
        style={{ width: 150, height: 150, borderRadius: 10, marginLeft: 10 }}
        resizeMethod='resize'
      />
      <View style={styles.viewMedio} >
        <Text style={styles.titulo} >{titulo}</Text>

        <Text style={styles.descripcion} >{descripcion.length > 20 ? descripcion.substring(0, 20) : descripcion}...</Text>

        <Text style={styles.precio} >{formatoMoneda(parseInt(precio))}
          {status === 1 ? <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 16 }} >  Activo</Text> : <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }} >  Pausado</Text>}
        </Text>

        <View style={styles.iconBar} >
          <View style={styles.iconAlta} >
            <Icon
              style={styles.iconAlta}
              type='material-community'
              name='check-outline'
              color='#25d366'
              onPress={() => {
                if (status === 1) {
                  Alert.alert('Pausar publicación',
                    'Esto pausara tu publicación y tus clientes ya no la podran ver. ¿Deseas continuar?',
                    [
                      {
                        style: 'default',
                        text: 'Confirmar',
                        onPress: async () => {
                          await actualizarRegistro('Productos', id, { status: 0 })
                          setProductos(await listarMisProductos())
                        }
                      },
                      {
                        style: 'default',
                        text: 'Salir',
                      }
                    ]
                  )
                } else {
                  Alert.alert('Reactivar publiacación',
                    'Esto volvera a mostrar tu publicación a tus clientes. ¿Deseas continuar?',
                    [
                      {
                        style: 'default',
                        text: 'Confirmar',
                        onPress: async () => {
                          await actualizarRegistro('Productos', id, { status: 1 })
                          setProductos(await listarMisProductos())
                        }
                      },
                      {
                        style: 'default',
                        text: 'Salir',
                      }
                    ]
                  )
                }
              }}
              reverse
              size={16}
            />
          </View>

          <View style={styles.iconEdit} >
            <Icon
              style={styles.iconEdit}
              type='material-community'
              name='pencil-outline'
              color='#ffa000'
              onPress={() => { navigation.navigate('EditarProducto', { id }) }}
              reverse
              size={16}
            />
          </View>

          <View style={styles.iconDelete} >
            <Icon
              style={styles.iconDelete}
              type='material-community'
              name='trash-can-outline'
              color='#d32f2f'
              onPress={() => {
                Alert.alert(
                  'Advertencia',
                  'Esta acción eliminara su publicación definitivamente. ¿Desea continuar?',
                  [
                    {
                      style: 'default',
                      text: 'Continuar',
                      onPress: (
                        async () => {
                          await eliminarProducto('Productos', id)
                          setProductos(await listarMisProductos())
                        }
                      )

                    },
                    {
                      style: 'cancel',
                      text: 'Salir',
                    }
                  ]
                )
              }}
              reverse
              size={16}
            />
          </View>
        </View>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  containerBtnSuscription: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  containerBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colorMarca,
    shadowColor: colorMarca,
    shadowOffset: { height: 10 },
    shadowOpacity: 0.9,
  },
  viewMedio: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#075e54',
  },
  descripcion: {
    fontSize: 16,
    color: '#757575'
  },
  precio: {
    fontSize: 16,
    color: colorMarca,
    fontWeight: 'bold'
  },
  iconBar: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAlta: {
    borderWidth: 1,
    borderColor: '#25d366',
    padding: 3,
    borderRadius: 60,
    marginLeft: 5
  },
  iconEdit: {
    borderWidth: 1,
    borderColor: '#ffa000',
    padding: 3,
    borderRadius: 50,
    marginLeft: 5
  },
  iconDelete: {
    borderWidth: 1,
    borderColor: '#d32f2f',
    padding: 3,
    borderRadius: 50,
    marginLeft: 5
  },
})
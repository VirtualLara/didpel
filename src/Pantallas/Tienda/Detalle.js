import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, Alert } from 'react-native';
import { Avatar, Input, Button, Rating } from 'react-native-elements';
import { size } from 'lodash';

import { obtenerRegistroXID, obtenerUsuario } from '../../Utils/Acciones';
import { formatoMoneda } from '../../Utils/Utils';
import { colorMarca, colorBotonMiTienda, myBackgoroundColor } from '../../Utils/colores';
import Loading from '../../Componentes/Loading';
import Carousel from '../../Componentes/Carousel';
import { Icon } from 'react-native-elements/dist/icons/Icon';

export default function Detalle(props) {

  const { route } = props;
  const { id, titulo } = route.params;

  const [producto, setProducto] = useState({});
  const [expoPushToken, setExpoPushToken] = useState('');
  const [nombreVendedor, setNombreVendedor] = useState('Nombre');
  const [photoVendedor, setPhotoVendedor] = useState('');
  const [phoneVendedor, setPhoneVendedor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const usuarioActual = obtenerUsuario();

  useEffect(() => {
    (async () => {
      setProducto((await obtenerRegistroXID('Productos', id)).data);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (size(producto) > 0) {
        const resultado = (await obtenerRegistroXID('Usuarios', producto.usuario)).data;

        setExpoPushToken(resultado.token);
        setNombreVendedor(resultado.displayName);
        setPhotoVendedor(resultado.photoURL);
        setPhoneVendedor(resultado.phoneNumber);

      }
    })()
  }, [producto])

  if (size(producto.imagenes) > 0) {
    return (
      <ScrollView style={styles.container} >
        <Carousel
          data={producto.imagenes}
          height={400}
          width={Dimensions.get('window').width}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
        />

        <View style={styles.boxSuperior} >
          <View style={{ backgroundColor: '#25d366', borderBottomWidth: 2, width: 100, alignSelf: 'center' }} />
          <Text style={styles.titulo} >{producto.titulo}</Text>
          <Text style={styles.precio} >{formatoMoneda(parseInt(producto.precio))}</Text>

          <View>
            <Text style={styles.descripcion} >{producto.descripcion}</Text>
            <Rating
              type='star'
              ratingBackgroundColor='#c8c7c8'
              startingValue={producto.rating}
              imageSize={25}
              readonly
              tintColor={myBackgoroundColor}
            />
          </View>

          <Text style={styles.titulo} >Contactar al anunciante</Text>

          <View style={styles.avatarBox} >
            <Avatar
              source={photoVendedor ? { uri: photoVendedor } : require('../../../assets/avatar.jpg')}
              style={styles.avatar}
              rounded
              size='large'
            />

            <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 10, }} >
              <Text style={styles.displayName} >{nombreVendedor ? nombreVendedor : 'Anónimo'}</Text>
              <View style={styles.boxInterno} >
                <Icon
                  type='material-community'
                  name='message-text-outline'
                  color={colorBotonMiTienda}
                  size={50}
                  onPress={() => {
                    Alert.alert('Pronto podras enviar mensajes al anunciante')
                  }}
                />

                <Icon
                  type='material-community'
                  name='whatsapp'
                  color={colorBotonMiTienda}
                  size={50}
                  onPress={() => {
                    Alert.alert('Pronto podras contactar por whastapp al anunciante')
                  }}
                />
              </View>
            </View>
          </View>




        </View>
      </ScrollView>
    )
  } else {
    return (
      <Loading isVisible={true} text='Cargando...' />
    )
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  boxSuperior: {
    backgroundColor: myBackgoroundColor,
    marginTop: -30,
    paddingTop: 20,
    borderRadius: 40,
    alignItems: 'center',
    width: '98%',
    alignSelf: 'center'
  },
  titulo: {
    color: colorMarca,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  precio: {
    fontSize: 18,
    color: colorBotonMiTienda,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  descripcion: {
    fontWeight: '300',
    fontSize: 16,
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#757575',
    textAlign: 'center',
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  boxInterno: {
    width: 150,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorBotonMiTienda
  },
})
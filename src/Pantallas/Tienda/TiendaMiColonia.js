import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StatusBar, StyleSheet, Alert, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Icon, Avatar, Image, Rating, Badge } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { size } from 'lodash';

import { colorBotonMiTienda, colorMarca } from '../../Utils/colores';
import { listarProductosMiColonia, listarProductosPorCategoriaColonia, listarNotificacionesPendientes } from '../../Utils/Acciones';
import { formatoMoneda } from '../../Utils/Utils';
import Busqueda from '../../Componentes/Busqueda';
import Loading from '../../Componentes/Loading';

export default function TiendaMiColonia() {

  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [mensajes, setMensajes] = useState('No hay publicaciones en tu colonia ' +
    '' +
    'O AUN NO REGISTRAS TU COLONIA...');
  const [notificaciones, setNotificaciones] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setNotificaciones(0)
        setList(await listarProductosMiColonia());

        const consulta = await listarNotificacionesPendientes();
        if (consulta.statusresponse) {
          setNotificaciones(size(consulta.data))
        }
        setCargando(true)
      })()
    }, [])
  );

  const cargarFiltroPorCategoria = async (categoria) => {

    setLoading(true);

    const listaProductosCategoria = await listarProductosPorCategoriaColonia(categoria);
    setList(listaProductosCategoria);

    if (listaProductosCategoria.length === 0) {
      setMensajes('No se encontraron datos para la categoría ' + categoria)
    }

    setLoading(false);

  }

  const actualizarProductos = async () => {
    setLoading(true);
    setList(await listarProductosMiColonia());
    setLoading(false);
  }

  function Producto(props) {
    const { producto, navigation } = props;
    const { titulo, descripcion, precio, imagenes, rating, id, usuario, } = producto.item;
    const { displayName, photoURL } = usuario;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => { navigation.navigate('Detalle', { id, titulo }) }}
      >
        <Image source={{ uri: imagenes[0] }} style={styles.imgProducto} />
        <View style={styles.infoBox} >
          <Text style={styles.titulo} >{titulo}</Text>
          <Text style={{ width: '90%', fontSize: 16 }} > {size(descripcion) > 26 ? `${descripcion.substring(0, 27)}...` : descripcion}</Text>

          <Rating
            imageSize={25}
            startingValue={rating}
            readonly
          />
          <Text style={styles.precio} > {formatoMoneda(parseInt(precio))} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  function BotonCategoria(props) {

    const { categoriaBoton, categoria, icon, texto, setCategoria, cargarFiltroPorCategoria, } = props;

    return (
      <TouchableOpacity
        style={categoria === categoriaBoton ? styles.categoriaHover : styles.categoriaBtn}
        onPress={() => {
          setCategoria(categoriaBoton)
          cargarFiltroPorCategoria(categoriaBoton)
        }}
      >
        <Icon
          type='material-community'
          name={icon}
          size={30}
          color={categoria === categoriaBoton ? '#fff' : colorMarca}
        />
        <Text style={categoria === categoriaBoton ? styles.txtHover : styles.txt} > {texto} </Text>
      </TouchableOpacity>
    )

  }


  if (cargando) {
    return (
      <View style={styles.frame} >
        <StatusBar backgroundColor={colorMarca} />
        <Loading isVisible={loading} text='Cargando...' />

        <View style={styles.header} >
          <KeyboardAwareScrollView>

            <View style={styles.menu} >

              <View style={{ width: '85%' }}  >
                <Busqueda
                  setList={setList}
                  actualizar={actualizarProductos}
                  setSearch={setSearch}
                  search={search}
                  setMensajes={setMensajes}
                  placeholder={'Buscalo - Encuentralo - Adquierelo'}
                  query={`SELECT * FROM Productos WHERE titulo LIKE '${search}%' OR descripcion LIKE '${search}%'`}
                />
              </View>

              <View style={{ width: '10%' }} >
                <Icon
                  type='material-community'
                  name='bell-outline'
                  color='#fff'
                  size={30}
                  onPress={() => { navigation.navigate('Mensajes') }}
                />
                {notificaciones > 0 && (
                  <Badge
                    status='error'
                    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    value={notificaciones}
                  />
                )}
              </View>

            </View>

          </KeyboardAwareScrollView>

        </View>

        <View style={styles.categoriaView} >
          <View style={styles.tituloCategoria} >
            <Text style={styles.tituloTxt} > - CATEGORIAS - </Text>
            {categoria.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setCategoria('');
                  actualizarProductos();
                }
                }
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <Icon
                  type='material-community'
                  color='red'
                  name='close'
                  reverse
                  size={10}
                />
                <Text style={{ color: '#fff', fontWeight: 'bold', backgroundColor: 'red' }} > Limpiar Filtro </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.categoriasList} >
            <BotonCategoria
              categoriaBoton='articulos'
              categoria={categoria}
              icon='cart-arrow-down'
              texto='Artículos'
              setCategoria={setCategoria}
              cargarFiltroPorCategoria={cargarFiltroPorCategoria}
            />
            <BotonCategoria
              categoriaBoton='servicios'
              categoria={categoria}
              icon='lightbulb-on-outline'
              texto='Servicios'
              setCategoria={setCategoria}
              cargarFiltroPorCategoria={cargarFiltroPorCategoria}
            />
            <BotonCategoria
              categoriaBoton='profesionales'
              categoria={categoria}
              icon='account-cash'
              texto='Serv. Prof...'
              setCategoria={setCategoria}
              cargarFiltroPorCategoria={cargarFiltroPorCategoria}
            />
            <BotonCategoria
              categoriaBoton='otros'
              categoria={categoria}
              icon='silverware-fork-knife'
              texto='Otros'
              setCategoria={setCategoria}
              cargarFiltroPorCategoria={cargarFiltroPorCategoria}
            />
          </View>
        </View>



        {
          size(list) > 0 ? (
            <FlatList
              data={list}
              renderItem={(producto) => (
                <Producto producto={producto} navigation={navigation} />
              )}
              keyExtractor={(Item, index) => index.toString()}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: colorBotonMiTienda, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }} > {mensajes} </Text>
            </View>
          )
        }


      </View >
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <ActivityIndicator
          size={50}
          color={colorBotonMiTienda}
        />

        <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold' }} >Obteniendo información...</Text>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: '10%',
    width: '100%',
    backgroundColor: colorMarca,
    alignContent: 'center',
    justifyContent: 'center'
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  card: {
    width: '100%',
    paddingVertical: 20,
    flex: 1,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderBottomColor: colorMarca,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgProducto: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  infoBox: {
    paddingLeft: 10,
    alignItems: 'center',
    flex: 1,
  },
  titulo: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: colorMarca,
  },
  vendidoPor: {
    fontSize: 16,
    marginTop: 5,
    color: colorMarca,
    fontWeight: '700'
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  displayName: {

  },
  precio: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: colorMarca,
    alignSelf: 'center'
  },
  categoriaHover: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 7.0,
      height: -8.0,
    },
    shadowOpacity: 0.5,
    shadowColor: '#000',
    backgroundColor: colorBotonMiTienda,
    borderRadius: 40,
    elevation: 1
  },
  categoriaBtn: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 7.0,
      height: -8.0,
    },
    shadowOpacity: 0.5,
    shadowColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 40,
    elevation: 1
  },
  txtHover: {
    fontSize: 12,
    fontStyle: 'italic',
    color: "#fff"
  },
  txt: {
    fontSize: 12,
    color: colorMarca,
  },
  categoriaView: {
    marginTop: 10,
  },
  tituloCategoria: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tituloTxt: {
    color: colorMarca,
    fontSize: 14,
    fontWeight: 'bold'
  },
  categoriasList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 5
  }
})
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, CheckBox, } from "react-native";
import { Input, Image, Button, Icon, Avatar, AirbnbRating } from 'react-native-elements';
import { map, size, filter, isEmpty, result, subtract } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Loading from '../../Componentes/Loading';
import { colorBotonMiTienda, colorMarca, textSemiAzul, textWarning } from '../../Utils/colores';
import { cargarImagen, sumarDias, } from '../../Utils/Utils';
import { subirImagenesBatch, actualizarRegistro, obtenerUsuario, obtenerRegistroXID } from '../../Utils/Acciones';

export default function AgregarProducto(props) {

  const { route } = props;
  const { id } = route.params;
  const navigation = useNavigation();

  const [titulo, seTtitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [colonia, setColonia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [errores, setErrores] = useState({});
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [seleccion, setSeleccion] = useState(false);
  const btnref = useRef();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await obtenerRegistroXID('Productos', id);
      const { data } = response;
      seTtitulo(data.titulo);
      setDescripcion(data.descripcion);
      setPrecio(data.precio);
      setColonia(data.colonia);
      setCiudad(data.ciudad);
      setImagenes(data.imagenes);
      setCategoria(data.categoria);
      setRating(data.rating);
      setSeleccion(data.seleccion)
      setLoading(false);
    })()
  }, [])

  const EditProduct = async () => {
    setErrores({});

    if (isEmpty(titulo)) {
      setErrores({ titulo: "El campo titulo es obligatorio." })
    } else if (isEmpty(descripcion)) {
      setErrores({ descripcion: "El campo descripción es obligatorio." })
    } else if (!precio > 0) {
      setErrores({ precio: "Introduzca un precio para el producto." })
    } else if (isEmpty(colonia)) {
      setErrores({ colonia: "El campo colonia es obligatorio." })
    } else if (isEmpty(ciudad)) {
      setErrores({ ciudad: "El campo ciudad es obligatorio." })
    } else if (isEmpty(categoria)) {
      Alert.alert('Asignar categoría',
        'Favor de seleccionar una cateogoría para su producto o servicio',
        [
          {
            style: 'cancel',
            text: 'Entendido'
          }
        ])
    } else if (isEmpty(imagenes)) {
      Alert.alert('Proporcionar imágen(es)',
        'Favor de proporcionar al menos una imagen para su producto o servicio',
        [
          {
            style: 'cancel',
            text: 'Entendido'
          }
        ])
    } else {
      setLoading(true)
      const urlImagenes = await subirImagenesBatch(
        imagenes,
        'ImagenesProductos'
      )
      const producto = {
        titulo,
        descripcion,
        precio,
        colonia,
        ciudad,
        usuario: obtenerUsuario().uid,
        imagenes: urlImagenes,
        fechaactualizacion: new Date(),
        //status: 1,
        //fechacreacion: new Date(),
        //fechavigencia: vigenciaDias(seleccion),
        rating,
        categoria,
      }

      const registrarProducto = await actualizarRegistro('Productos', id, producto);

      if (registrarProducto.statusresponse) {
        setLoading(false)
        Alert.alert('Actualización Exitosa',
          'El producto o Servicio se actualizó de forma correcta',
          [
            {
              styles: 'cancel',
              text: 'Aceptar',
              onPress: () => navigation.navigate('Mitienda')
            }
          ]
        )
      } else {
        setLoading(false)
        Alert.alert('Actualización Fallida',
          'Ha ocurrido un error al actualizar el roducto o  servicio',
          [
            {
              styles: 'cancel',
              text: 'Aceptar',
            }
          ]
        )
      }
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container} >
      <View style={styles.line} />

      <Input
        placeholder='Título'
        onChangeText={(text) => seTtitulo(text)}
        inputStyle={styles.input}
        errorMessage={errores.titulo}
        value={titulo}
      />
      <Input
        placeholder='Descripción'
        onChangeText={(text) => setDescripcion(text)}
        inputStyle={styles.textArea}
        errorMessage={errores.descripcion}
        multiline={true}
        value={descripcion}
      />
      <Input
        placeholder='Precio'
        onChangeText={(text) => setPrecio(text)}
        inputStyle={styles.input}
        errorMessage={errores.precio}
        keyboardType='number-pad'
        value={parseInt(precio).toFixed(2)}
      />
      <Input
        placeholder='Colonia'
        onChangeText={(text) => setColonia(text)}
        inputStyle={styles.input}
        errorMessage={errores.colonia}
        value={colonia}
      />
      <Input
        placeholder='Ciudad'
        onChangeText={(text) => setCiudad(text)}
        inputStyle={styles.input}
        errorMessage={errores.ciudad}
        value={ciudad}
      />

      <Text style={styles.txtLabel} > Calidad del producto o servicio </Text>
      <AirbnbRating
        count={5}
        reviews={['Baja', 'Normal', 'Bueno', 'Muy bueno', 'Excelente']}
        defaultRating={3}
        size={25}
        onFinishRating={(value) => { setRating(value) }}
      />

      <Text style={styles.txtLabel} > Cargar Imágenes </Text>
      <SubirImagenes imagenes={imagenes} setImagenes={setImagenes} />

      <Text style={styles.txtLabel} > Asignar Categoría </Text>
      <Botonera categoria={categoria} setCategoria={setCategoria} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }} >
        <Text style={styles.txtLabelWarning} > Mantener publicación activa </Text>
        <CheckBox
          style={styles.checkbox}
          value={seleccion}
          disabled
          onValueChange={() => {
            if (seleccion) {
              setSeleccion(false)
            } else {
              Alert.alert(
                '¡Advertencia!',
                'Esta acción marcara la publicación activa por 28 días, tomando "4" publicaciones de la suscripción adquirida. ¿Desea continuar?',
                [
                  {
                    text: 'Cancelar',
                    style: 'Cancel',
                  },
                  {
                    text: 'Continuar',
                    onPress: () => {
                      setSeleccion(true);
                    }
                  }
                ]
              )
            }
          }

          }
        />
      </View>

      <Button
        title='Editar Producto o Servicio'
        buttonStyle={styles.btnAddNew}
        ref={btnref}
        onPress={EditProduct}
      />

      <Loading isVisible={loading} text='Favor de esperar...' />

    </KeyboardAwareScrollView>
  );
}

function SubirImagenes(props) {

  const { imagenes, setImagenes } = props;

  const removerImagen = (imagen) => {
    Alert.alert(
      'Elimiar Imagen',
      '¿Realmente deseas eliminar la imágen?',
      [
        {
          text: 'Cancelar',
          style: 'Cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            setImagenes(filter(imagenes, (imagenURL) => imagenURL !== imagen));
          }
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.viewImagenes} horizontal={true} showsHorizontalScrollIndicator={false} >
      {size(imagenes) < 5 && (
        <View style={styles.containerIcon} >
          <Icon
            type='material-community'
            name='plus'
            color='#7a7a7a'
            //containerStyle={styles.containerIcon}
            onPress={async () => {
              let resultado = await cargarImagen([1, 1]);
              if (resultado.status) {
                setImagenes([...imagenes, resultado.imagen])
              }
            }}
            reverse
          />
        </View>
      )}

      {map(imagenes, (imagen, index) => (
        <Avatar
          key={index}
          style={styles.miniatura}
          source={{ uri: imagen }}
          onPress={() => { removerImagen(imagen) }}
        />
      ))}

    </ScrollView>
  )

}

function Botonera(props) {

  const { categoria, setCategoria } = props;

  return (
    <View style={styles.botonera} >

      <TouchableOpacity
        style={styles.btonCategoria}
        onPress={() => { setCategoria('articulos') }}
      >
        <Icon
          type='material-community'
          name='cart-arrow-down'
          size={24}
          color={categoria === 'articulos' ? colorMarca : '#757575'}
          reverse
        />
        <Text>Artículos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btonCategoria}
        onPress={() => { setCategoria('servicios') }}
      >
        <Icon
          type='material-community'
          name='lightbulb-on-outline'
          size={24}
          color={categoria === 'servicios' ? colorMarca : '#757575'}
          reverse
        />
        <Text>Servicios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btonCategoria}
        onPress={() => { setCategoria('profesionales') }}
      >
        <Icon
          type='material-community'
          name='account-cash'
          size={24}
          color={categoria === 'profesionales' ? colorMarca : '#757575'}
          reverse
        />
        <Text>Serv. Profesional</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btonCategoria}
        onPress={() => { setCategoria('otros') }}
      >
        <Icon
          type='material-community'
          name='silverware-fork-knife'
          size={24}
          color={categoria === 'otros' ? colorMarca : '#757575'}
          reverse
        />
        <Text>Otros</Text>
      </TouchableOpacity>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    margin: 5,
    padding: 5,
    elevation: 3,
  },
  line: {
    borderBottomColor: colorBotonMiTienda,
    borderBottomWidth: 2,
    width: 100,
    marginTop: 20,
    alignSelf: 'center'
  },
  input: {
    width: '90%',
    borderRadius: 10,
    borderColor: '#707070',
    marginTop: 10,
    paddingHorizontal: 20,
    height: 50,
  },
  textArea: {
    height: 150
  },
  txtLabel: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: 'bold',
    color: textSemiAzul,
  },
  btnAddNew: {
    backgroundColor: colorMarca,
    marginTop: 20,
    marginBottom: 50,
    marginHorizontal: 20,
  },
  viewImagenes: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  containerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    height: 150,
    width: 100,
    backgroundColor: '#e3e3e3',
    padding: 10,
  },
  miniatura: {
    width: 100,
    height: 150,
    marginRight: 10
  },
  botonera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  btonCategoria: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLabelWarning: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontWeight: 'bold',
    color: textWarning,
    backgroundColor: "#000"
  }
})
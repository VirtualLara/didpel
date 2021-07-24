import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Avatar, Input, Button, Rating } from "react-native-elements";
import { size, upperCase } from "lodash";

import {
  addRegistro,
  obtenerRegistroXID,
  obtenerUsuario,
  sendPushNotification,
  setMensajeNotificacion,
} from "../../Utils/Acciones";
import { formatoMoneda, enviarMensajeWhastapp } from "../../Utils/Utils";
import {
  colorMarca,
  colorBotonMiTienda,
  myBackgoroundColor,
  nombreApp,
} from "../../Utils/colores";
import Loading from "../../Componentes/Loading";
import Carousel from "../../Componentes/Carousel";
import { Icon } from "react-native-elements/dist/icons/Icon";

import Modal from "../../Componentes/Modal";

export default function Detalle(props) {
  const { route } = props;
  const { id, titulo } = route.params;

  const [producto, setProducto] = useState({});
  const [expoPushToken, setExpoPushToken] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("Nombre");
  const [photoVendedor, setPhotoVendedor] = useState("");
  const [phoneVendedor, setPhoneVendedor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const usuarioActual = obtenerUsuario();

  useEffect(() => {
    (async () => {
      setProducto((await obtenerRegistroXID("Productos", id)).data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (size(producto) > 0) {
        const resultado = (
          await obtenerRegistroXID("Usuarios", producto.usuario)
        ).data;

        setExpoPushToken(resultado.token);
        setNombreVendedor(resultado.displayName);
        setPhotoVendedor(resultado.photoURL);
        setPhoneVendedor(resultado.phoneNumber);
      }
    })();
  }, [producto]);

  if (size(producto.imagenes) > 0) {
    return (
      <ScrollView style={styles.container}>
        <Carousel
          data={producto.imagenes}
          height={400}
          width={Dimensions.get("window").width}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
        />

        <View style={styles.boxSuperior}>
          <View
            style={{
              backgroundColor: "#25d366",
              borderBottomWidth: 2,
              width: 100,
              alignSelf: "center",
            }}
          />
          <Text style={styles.titulo}>{producto.titulo}</Text>
          <Text style={styles.precio}>
            {formatoMoneda(parseInt(producto.precio))}
          </Text>

          <View>
            <Text style={styles.descripcion}>{producto.descripcion}</Text>
            <Rating
              type="star"
              ratingBackgroundColor="#c8c7c8"
              startingValue={producto.rating}
              imageSize={25}
              readonly
              tintColor={myBackgoroundColor}
            />
          </View>

          <Text style={styles.titulo}>Contactar al anunciante</Text>

          <View style={styles.avatarBox}>
            <Avatar
              source={
                photoVendedor
                  ? { uri: photoVendedor }
                  : require("../../../assets/avatar.jpg")
              }
              style={styles.avatar}
              rounded
              size="large"
            />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <Text style={styles.displayName}>
                {nombreVendedor ? nombreVendedor : "Anónimo"}
              </Text>
              <View style={styles.boxInterno}>
                <Icon
                  type="material-community"
                  name="message-text-outline"
                  color={colorBotonMiTienda}
                  size={50}
                  onPress={() => {
                    setIsVisible(true);
                  }}
                />

                <Icon
                  type="material-community"
                  name="whatsapp"
                  color={colorBotonMiTienda}
                  size={50}
                  onPress={() => {
                    const mensajeWhastApp = `Estimad@ ${nombreVendedor}, mi nombre es ${usuarioActual.displayName}, me interesa el producto ${upperCase(producto.titulo)} que se encuentra publicado en la aplicación ${nombreApp}.`;
                    enviarMensajeWhastapp(phoneVendedor, mensajeWhastApp);
                  }}
                />
              </View>
            </View>
          </View>

          <EnviarMensaje
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            nombreVendedor={nombreVendedor}
            avatarVendedor={photoVendedor}
            mensaje={mensaje}
            setMensaje={setMensaje}
            receiver={producto.usuario}
            sender={usuarioActual.uid}
            token={expoPushToken}
            producto={producto}
            setLoading={setLoading}
            nombrecliente={usuarioActual.displayName}
          />
          <Loading isVisible={loading} text="Enviando mensaje..." />
        </View>
      </ScrollView>
    );
  } else {
    return <Loading isVisible={true} text="Cargando..." />;
  }
}

function EnviarMensaje(props) {
  const {
    isVisible,
    setIsVisible,
    nombreVendedor,
    avatarVendedor,
    mensaje,
    setMensaje,
    receiver,
    sender,
    token,
    producto,
    setLoading,
    nombrecliente,
  } = props;

  const enviarNotificacion = async () => {
    if (!mensaje) {
      Alert.alert("Validación", "Favor de introducir un mensaje.", [
        {
          style: "default",
          text: "Entendido",
        },
      ]);
    } else {
      setLoading(true);
      const notification = {
        sender: sender,
        receiver: receiver,
        mensaje: mensaje,
        fechacreacion: new Date(),
        productoid: producto.id,
        productotitulo: producto.titulo,
        visto: 0,
      };

      const resultado = await addRegistro("Notificaciones", notification);

      if (resultado.statusresponse) {
        const mensajeNotificacion = setMensajeNotificacion(
          token,
          `CLIENTE INTERESADO EN: ${producto.titulo}`,
          `${nombrecliente} te ha enviado un mensaje.`,
          { data: "Prospecto interesado." }
        );

        const respuesta = await sendPushNotification(mensajeNotificacion);
        setLoading(false);

        if (respuesta) {
          Alert.alert(
            "Acción exitosa",
            "Se ha enviado el mensaje corectamente",
            [
              {
                style: "cancel",
                text: "Entendido",
                onPress: () => setIsVisible(false),
              },
            ]
          );
          setMensaje('');
        } else {
          Alert.alert(
            "Error",
            "Se ha producido un error al enviar el mensaje, favor de itentar nuevamente.",
            [
              {
                style: "cancel",
                text: "Entendido",
              },
            ]
          );
          setIsVisible(false);
        }
      }
    }
  };

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 16,
          borderRadius: 20,
        }}
      >
        <Avatar
          source={
            avatarVendedor
              ? { uri: avatarVendedor }
              : require("../../../assets/avatar.jpg")
          }
          style={styles.photoVendor}
        />
        <Text
          style={{
            color: colorBotonMiTienda,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Envia un mensaje a {nombreVendedor}
        </Text>
        <Input
          placeholder="Escribe un mensaje..."
          multiline={true}
          inputStyle={styles.textArea}
          onChangeText={(text) => {
            setMensaje(text);
          }}
          value={mensaje}
        />

        <Button
          title="Enviarmensaje"
          buttonStyle={styles.btnSend}
          containerStyle={{ width: "90%" }}
          onPress={enviarNotificacion}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  boxSuperior: {
    backgroundColor: myBackgoroundColor,
    marginTop: -30,
    paddingTop: 20,
    borderRadius: 40,
    alignItems: "center",
    width: "98%",
    alignSelf: "center",
  },
  titulo: {
    color: colorMarca,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  precio: {
    fontSize: 18,
    color: colorBotonMiTienda,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  descripcion: {
    fontWeight: "300",
    fontSize: 16,
    alignSelf: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    color: "#757575",
    textAlign: "center",
  },
  avatarBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  boxInterno: {
    width: 150,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorBotonMiTienda,
  },
  photoVendor: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  textArea: {
    height: 150,
  },
  btnSend: {
    backgroundColor: colorMarca,
  },
});

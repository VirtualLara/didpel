import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import moment from "moment/min/moment-with-locales";
import { size } from "lodash";

import {
  listarNotificacionesLeidas,
  actualizarRegistro,
} from "../../Utils/Acciones";
import { colorBotonMiTienda, colorMarca } from "../../Utils/colores";
import { TouchableOpacityComponent } from "react-native";

export default function MensajesLeidos() {
  const [notificaciones, setNotificaciones] = useState(null);
  const [mensaje, setMensaje] = useState("No notificaciones notificaciones leídas...");
  const [usuario, setUsuario] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();
  moment.locale("es");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const consulta = await listarNotificacionesLeidas();
        if (consulta.statusresponse) {
          setNotificaciones(consulta.data);
        } else {
          setMensaje("No notificaciones notificaciones leídas...");
        }
        setCargando(true);
      })();
    }, [])
  );


  if (cargando) {
    if (notificaciones) {
      return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              color: colorMarca,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Mensajes leidos{" "}
          </Text>
          <FlatList
            data={notificaciones}
            renderItem={(item) => (
              <Notificacion notificacion={item} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colorBotonMiTienda,
              textAlign: 'center',
            }}
          >
            {mensaje}
          </Text>
        </View>
      );
    }
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <ActivityIndicator size={50} color={colorBotonMiTienda} />
        <Text style={{ fontSize: 20, color: colorBotonMiTienda, fontWeight: 'bold' }} >Obteniendo información...</Text>
      </View>
    )
  }

}

function Notificacion(props) {
  const { notificacion, navigation } = props;
  const { mensaje, fechacreacion, sender, id, productotitulo } =
    notificacion.item;
  const { displayName, photoURL, phoneNumber, email } = sender;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Contacto", {
          displayName,
          phoneNumber,
          photoURL,
          email,
          mensaje,
          productotitulo,
        });
        actualizarRegistro("Notificaciones", notificacion.item.id, {
          visto: 1,
        });
      }}
    >
      <View style={styles.container}>
        <View>
          <Avatar
            size="large"
            source={
              photoURL
                ? { uri: photoURL }
                : require("../../../assets/avatar.jpg")
            }
            style={styles.avatar}
            rounded
          />
        </View>

        <View style={{ width: "90%" }}>
          <Text style={{ fontWeight: "bold" }}>
            {displayName}
            <Text style={{ fontWeight: "normal" }}>
              {" "}
              Te ha enviado un mensaje para el producto{" "}
            </Text>
            <Text style={{ fontWeight: "bold" }}>{productotitulo}</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colorBotonMiTienda,
              fontWeight: "bold",
            }}
          >
            Enviado: {moment(fechacreacion.toDate()).startOf("hour").fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingLeft: 10,
    paddingRight: 40,
    borderBottomColor: "#bdbdbd",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
})

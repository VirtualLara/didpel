import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import moment from 'moment/min/moment-with-locales'
import { size } from 'lodash'

import { listarNotificacionesPendientes, actualizarRegistro } from "../../Utils/Acciones";
import { colorBotonMiTienda, colorMarca } from "../../Utils/colores";

export default function MensajesList() {
  const [notificaciones, setNotificaciones] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState("");

  const navigation = useNavigation();
  moment.locale('es');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const consulta = await listarNotificacionesPendientes();
        if (consulta.statusresponse) {
          setNotificaciones(consulta.data);
        } else {
          setMensaje("No se econtraron mesajes por notificaciones leídas...");
        }
      })();
    }, [])
  )

  if (!notificaciones) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: colorBotonMiTienda,
          }}
        >
          {mensaje}
        </Text>
      </View>
    );
  }

  return (
    notificaciones && (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Text style={{ fontSize: 20, color: colorMarca, fontWeight: 'bold', textAlign: 'center' }} > ~ Mensajes pendientes ~ </Text>
        <FlatList
          data={notificaciones}
          renderItem={(item) => (
            <Notificacion notificacion={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  );
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
        });
        console.log(notificacion)
        actualizarRegistro('Notificaciones', notificacion.item.id, { visto: 1 })
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

        <View style={{ width: '90%' }} >
          <Text style={{ fontWeight: "bold" }}>{displayName}
            <Text style={{ fontWeight: "normal" }}> Te ha enviado un mensaje para el producto </Text>
            <Text style={{ fontWeight: "bold" }}>{productotitulo}</Text>
          </Text>
          <Text style={{ fontSize: 16, color: colorBotonMiTienda, fontWeight: 'bold' }} >Enviado: {moment(fechacreacion.toDate()).startOf('hour').fromNow()}</Text>
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
    backgroundColor: '#D5D8DC'
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

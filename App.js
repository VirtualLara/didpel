import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, LogBox } from "react-native";
import RutasNoAutenticadas from './src/Navegacion/RutasNoAutenticadas';
import SwitchNavigator from './src/Navegacion/SwitchNavigator';
import { validarSesion, iniciarNotificaciones } from "./src/Utils/Acciones";
import Loading from "./src/Componentes/Loading";

//ignora los warning amarillos
LogBox.ignoreLogs(['Setting a timer'])

export default function App() {

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setLoading(true);
    validarSesion(setUser);
    iniciarNotificaciones(notificationListener, responseListener)
    setLoading(false);
  }, [])

  if (loading) {
    return (
      <Loading isVisible={loading} text='Cargando...' />
    )
  } else {
    return user ? <SwitchNavigator /> : <RutasNoAutenticadas />
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

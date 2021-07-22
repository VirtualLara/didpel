import React, { useState, useEffect } from "react";
import { StyleSheet, LogBox } from "react-native";
import RutasNoAutenticadas from './src/Navegacion/RutasNoAutenticadas';
import SwitchNavigator from './src/Navegacion/SwitchNavigator';
import { validarSesion } from "./src/Utils/Acciones";
import Loading from "./src/Componentes/Loading";

//ignora los warning amarillos
LogBox.ignoreLogs(['Setting a timer'])

export default function App() {

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    validarSesion(setUser);
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

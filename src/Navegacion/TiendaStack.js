import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores';

import Tienda from "../Pantallas/Tienda/Tienda.js";
import Detalle from "../Pantallas/Tienda/Detalle";
import Contacto from "../Pantallas/Tienda/Contacto";
import MensajesList from "../Pantallas/Tienda/MensajesList";
import TabMensajes from '../Navegacion/TabMensajes'


export default function TiendaStack() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Tienda}
        name="Tienda"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Detalle}
        name="Detalle"
        options={{
          headerTransparent: true,
          headerTintColor: colorMarca,
          title: "",
        }}
      />
      <Stack.Screen
        component={TabMensajes}
        name="Mensajes"
        options={{
          title: "Mensajes",
          headerStyle: { backgroundColor: colorMarca },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        component={Contacto}
        name="Contacto"
        options={{
          title: "Contacto",
          headerStyle: { backgroundColor: colorMarca },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>

  );
}

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores';

import MiTienda from "../Pantallas/Mitienda/MiTienda";
import EditarProducto from "../Pantallas/Mitienda/EditarProducto";
import AgregarProducto from "../Pantallas/Mitienda/AgregarProducto";
import AdquirirSuscripcion from "../Pantallas/Mitienda/AdquirirSuscripcion";


export default function MitiendaStack() {

  const Stack = createStackNavigator();

  return (

    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colorMarca,
        },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >

      <Stack.Screen
        name="Mitienda"
        component={MiTienda}
        options={{ title: "Mi tienda" }}
      />
      <Stack.Screen
        component={AgregarProducto}
        name="AgregarProducto"
        options={{
          title: "Agregar Nuevo Producto",
          headerStyle: { backgroundColor: colorMarca },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="EditarProducto"
        component={EditarProducto}
        options={{ title: "Editar Producto" }}
      />
      <Stack.Screen
        name="AdquirirSuscripcion"
        component={AdquirirSuscripcion}
        options={{ title: "Adquirir publicaciones" }}
      />
    </Stack.Navigator>

  );
}

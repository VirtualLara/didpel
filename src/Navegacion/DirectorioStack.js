import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores';

import TabDirectorio from "../Navegacion/TabDirectorio";
import PublicacionesPorAnunciante from "../Pantallas/Directorio/PublicacionesPorAnunciante";


export default function DirectorioStack() {

  const Stack = createStackNavigator();

  return (

    <Stack.Navigator>
      <Stack.Screen
        component={TabDirectorio}
        name="TabDirectorio"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={PublicacionesPorAnunciante}
        name="PublicacionesPorAnunciante"
        options={{ title: 'Publicaciones del anunciante' }}
      />
    </Stack.Navigator>

  );
}

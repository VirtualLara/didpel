import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores';

import Directorio from "../Pantallas/Directorio/Directorio";


export default function DirectorioStack() {

  const Stack = createStackNavigator();

  return (

    <Stack.Navigator>
      <Stack.Screen
        component={Directorio}
        name="Directorio"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>

  );
}

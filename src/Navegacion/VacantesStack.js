import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores';

import Vacantes from "../Pantallas/Empleo/Vacantes";


export default function EmpleoStack() {

  const Stack = createStackNavigator();

  return (

    <Stack.Navigator>
      <Stack.Screen
        component={Vacantes}
        name="Vacantes"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>

  );
}

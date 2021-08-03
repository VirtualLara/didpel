import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Perfil from '../Pantallas/Perfil/Perfil';
import IdCliente from '../Pantallas/Perfil/IdCliente';
import AgregarVacante from '../Pantallas/Empleo/AgregarVacante';

const Stack = createStackNavigator();

export default function PerfilStack() {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name='Perfil'
                component={Perfil}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='AgregarVacante'
                component={AgregarVacante}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='IdCliente'
                component={IdCliente}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>

    )
}
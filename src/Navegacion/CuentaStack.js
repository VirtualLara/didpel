import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colorMarca } from '../Utils/colores'

import ConfirmarNumero from '../Pantallas/Cuenta/ConfirmarNumero';
import EnviarConfirmacion from '../Pantallas/Cuenta/EnviarConfirmacion';

export default function CuentaStack() {

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='EnviarConfirmacion'
                    component={EnviarConfirmacion}
                    options={{
                        title: 'Confirmar Número Celular',
                        headerStyle: { backgroundColor: colorMarca },
                        headerTintColor: '#fff',
                    }}
                />
                <Stack.Screen
                    name='ConfirmarNumero'
                    component={ConfirmarNumero}
                    options={{
                        title: 'Confirmar Número',
                        headerStyle: { backgroundColor: colorMarca },
                        headerTintColor: '#fff'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
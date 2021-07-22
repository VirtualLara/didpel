import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from '../Pantallas/Cuenta/Login';
import Registrar from '../Pantallas/Cuenta/Registrar';
import RestaurarPassword from '../Pantallas/Cuenta/RestaurarPassword';


export default function RutasNoAutenticadas() {

    const Stack = createStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'
                screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name='Login'
                    component={Login}
                />
                <Stack.Screen
                    name='Registrar'
                    component={Registrar}
                />
                <Stack.Screen
                    name='RestaurarPassword'
                    component={RestaurarPassword}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

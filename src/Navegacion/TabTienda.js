import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colorIconTabMensajes, colorTabMensajes, colorMarca } from '../Utils/colores';


import MensajesList from './../Pantallas/Tienda/MensajesList';
import MensajesLeidos from './../Pantallas/Tienda/MensajesLeidos';


const Tab = createMaterialTopTabNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName='MensajesList'
            tabBarOptions={{
                inactiveTintColor: '#fff',
                activeTintColor: colorIconTabMensajes,
                style: {
                    backgroundColor: colorMarca,
                }
            }}
        >
            <Tab.Screen
                component={MensajesList}
                name='MensajesList'
                options={{ title: 'Pendientes' }}
            />
            <Tab.Screen
                component={MensajesLeidos}
                name='MensajesLeidos'
                options={{ title: 'Leidos', }}
            />
        </Tab.Navigator>
    )
}

export default function TabTienda() {
    return (
        <TabBar />
    );
}
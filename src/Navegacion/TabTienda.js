import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colorIconTabMensajes, colorTabMensajes, colorMarca } from '../Utils/colores';


import TiendaMiColonia from './../Pantallas/Tienda/TiendaMiColonia';
import TiendaMiCiudad from './../Pantallas/Tienda/TiendaMiCiudad';
import Tienda from './../Pantallas/Tienda/Tienda';


const Tab = createMaterialTopTabNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName='TiendaMiColonia'
            tabBarOptions={{
                inactiveTintColor: '#fff',
                activeTintColor: colorIconTabMensajes,
                style: {
                    backgroundColor: colorMarca,
                }
            }}
        >
            <Tab.Screen
                component={TiendaMiColonia}
                name='TiendaMiColonia'
                options={{ title: 'Mi colonia' }}
            />
            <Tab.Screen
                component={TiendaMiCiudad}
                name='TiendaMiCiudad'
                options={{ title: 'Mi ciudad', }}
            />
            <Tab.Screen
                component={Tienda}
                name='Tienda'
                options={{ title: 'Todos', }}
            />
        </Tab.Navigator>
    )
}

export default function TabTienda() {
    return (
        <TabBar />
    );
}
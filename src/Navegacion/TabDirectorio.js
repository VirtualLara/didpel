import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colorIconTabMensajes, colorTabMensajes, colorMarca } from '../Utils/colores';

import DirectorioMiColonia from './../Pantallas/Directorio/DirectorioMiColonia';
import DirectorioMiCiudad from './../Pantallas/Directorio/DirectorioMiCiudad';
import Directorio from './../Pantallas/Directorio/Directorio';



const Tab = createMaterialTopTabNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName='VacantesMiColonia'
            tabBarOptions={{
                inactiveTintColor: '#fff',
                activeTintColor: colorIconTabMensajes,
                style: {
                    backgroundColor: colorMarca,
                }
            }}
        >
            <Tab.Screen
                component={DirectorioMiColonia}
                name='DirectorioMiColonia'
                options={{ title: 'Mi colonia' }}
            />
            <Tab.Screen
                component={DirectorioMiCiudad}
                name='DirectorioMiCiudad'
                options={{ title: 'Mi ciudad', }}
            />
            <Tab.Screen
                component={Directorio}
                name='Directorio'
                options={{ title: 'Todos', }}
            />
        </Tab.Navigator>
    )
}

export default function TabDirectorio() {
    return (
        <TabBar />
    );
}
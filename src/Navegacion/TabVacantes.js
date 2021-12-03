import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colorIconTabMensajes, colorTabMensajes, colorMarca } from '../Utils/colores';

import VacantesMiColonia from './../Pantallas/Empleo/VacantesMiColonia';
import VacantesMiCiudad from './../Pantallas/Empleo/VacantesMiCiudad';
import Vacantes from './../Pantallas/Empleo/Vacantes';



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
                component={VacantesMiColonia}
                name='VacantesMiColonia'
                options={{ title: 'Mi colonia' }}
            />
            <Tab.Screen
                component={VacantesMiCiudad}
                name='VacantesMiCiudad'
                options={{ title: 'Mi ciudad', }}
            />
            <Tab.Screen
                component={Vacantes}
                name='Vacantes'
                options={{ title: 'Todos', }}
            />
        </Tab.Navigator>
    )
}

export default function TabVacantes() {
    return (
        <TabBar />
    );
}
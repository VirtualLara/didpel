import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon } from 'react-native-elements';
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
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => mostrarIcono(route, color),
            })}
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

export default function TabMensajes() {
    return (
        <TabBar />
    );
}

function mostrarIcono(route, color) {

    let iconName = ''

    switch (route.name) {
        case 'MensajesList':
            iconName = 'book'
            break;

        case 'MensajesLeidos':
            iconName = 'book-open'
            break;
    }
    return (
        <Icon type='material-community' name={iconName} size={24} color={color} />
    )
}
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../Componentes/CustomDrawerContent";
import { Icon } from 'react-native-elements';
import { colorMarca } from '../Utils/colores';

import TiendaStack from './TiendaStack';
import Directorio from './DirectorioStack';
import ShopButton from '../Componentes/ShopButton';
import MiTienda from './MiTiendaStack';
import Vacantes from './VacantesStack';
import PerfilStack from './PerfilStack';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator
            initialRouteName='tienda'
            tabBarOptions={{
                inactiveTintColor: '#fff',
                activeTintColor: '#fff',
                style: {
                    //borderTopLeftRadius: 60,
                    //borderTopRightRadius: 60,
                    alignItems: 'center',
                    backgroundColor: colorMarca,
                    paddingBottom: 5,
                }
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => mostrarIcono(route, color),
            })}
        >
            <Tab.Screen
                component={TiendaStack}
                name='Tienda'
                options={{ title: 'Tienda' }}
            />
            <Tab.Screen
                component={Directorio}
                name='Directorio'
                options={{ title: 'Directorio' }}
            />
            <Tab.Screen
                component={MiTienda}
                name='MiTienda'
                options={{
                    title: '',
                    tabBarIcon: () => <ShopButton />
                }}
            />
            <Tab.Screen
                component={Vacantes}
                name='Vacantes'
                options={{ title: 'Vacantes' }}
            />
            <Tab.Screen
                component={PerfilStack}
                name='Perfil'
                options={{ title: 'Perfil' }}
            />
        </Tab.Navigator>
    )
}

function mostrarIcono(route, color) {

    let iconName = ''

    switch (route.name) {
        case 'Tienda':
            iconName = 'cart-outline'
            break;

        case 'Directorio':
            iconName = 'book'
            break;

        case 'MiTienda':
            iconName = 'cart-outline'
            break;

        case 'Vacantes':
            iconName = 'file'
            break;

        case 'Perfil':
            iconName = 'account-circle-outline'
            break;
    }
    return (
        <Icon type='material-community' name={iconName} size={24} color={color} />
    )
}

export default function RutasAutenticadas() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
                <Drawer.Screen
                    name="Tienda"
                    component={TabBar}
                    options={{
                        title: "Tienda",
                        drawerIcon: () => {
                            <Icon type="material-community" name="store" size={24} />;
                        },
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}


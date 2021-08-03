import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../Componentes/CustomDrawerContent";
import { Icon } from 'react-native-elements';
import { colorMarca, colorBotonMiTienda } from '../Utils/colores';

import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import TiendaStack from './TiendaStack';
import Directorio from './DirectorioStack';
import ShopButton from '../Componentes/ShopButton';
import MiTienda from './MiTiendaStack';
import Vacantes from './VacantesStack';
import PerfilStack from './PerfilStack';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabBar = () => {
    return (

        <Tab.Navigator activeColor="#fff" barStyle={styles.navigationStyle}
            initialRouteName='tienda'
            screenOptions={({ route }) => ({
                tabBarIcon: (routeStatus) => {
                    return mostrarIcono(route, routeStatus);
                }
            })}>
            <Tab.Screen
                component={TiendaStack}
                name='Tienda'
            />
            <Tab.Screen
                component={Directorio}
                name='Directorio'
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
                name='Empleo'
            />
            <Tab.Screen
                component={PerfilStack}
                name='Perfil'
            />
        </Tab.Navigator>
    )
}

function mostrarIcono(route, routeStatus) {
    let iconName = "";

    switch (route.name) {
        case 'Tienda':
            iconName = 'shopping-cart'
            break;

        case 'Directorio':
            iconName = 'book'
            break;

        case 'MiTienda':
            iconName = 'cart-plus'
            break;

        case 'Empleo':
            iconName = 'file'
            break;

        case 'Perfil':
            iconName = 'user'
            break;
    }
    return <AwesomeIcon name={iconName} style={styles.icon} />
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





const styles = StyleSheet.create({
    navigationStyle: {
        backgroundColor: colorMarca,
        color: colorMarca,
    },
    icon: {
        fontSize: 23,
        color: '#fff'
    },
})
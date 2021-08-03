import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import { obtenerUsuario, cerrarSesion } from "../Utils/Acciones";
import { colorMarca, colorBotonMiTienda } from '../Utils/colores';


export default function CustomDrawerContent(props) {
    const { displayName, photoURL, email } = obtenerUsuario();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>

                    <View style={styles.userInfoSection}>

                        <Image source={require('../../assets/personasprueba.jpg')} style={styles.logo} />

                        <View style={{ flexDirection: "row", marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar
                                rounded
                                style={styles.avatar}
                                size="medium"
                                source={photoURL ? { uri: photoURL } : require("../../assets/avatar.jpg")}
                            />
                        </View>

                        <Text style={styles.title}>{displayName}</Text>
                        <Text style={styles.caption}>{email} </Text>

                    </View>

                    <View style={styles.drawerSection}>

                        <DrawerMenu
                            iconName="shopping-cart"
                            titleName="Tienda"
                            navigation={() => props.navigation.navigate("Tienda")}
                        />

                        <DrawerMenu
                            iconName="book"
                            titleName="Directorio"
                            navigation={() => props.navigation.navigate("Directorio")}
                        />

                        <DrawerMenu
                            iconName="list"
                            titleName="Mis publicaciones"
                            navigation={() => props.navigation.navigate("MiTienda")}
                        />

                        <DrawerMenu
                            iconName="file"
                            titleName="Empleo"
                            navigation={() => props.navigation.navigate("Vacantes")}
                        />

                        <DrawerMenu
                            iconName="plus-square"
                            titleName="Oferta de empleo"
                            navigation={() => props.navigation.navigate("AgregarVacante")}
                        />

                        <DrawerMenu
                            iconName="user"
                            titleName="Mi Perfil"
                            navigation={() => props.navigation.navigate("Perfil")}
                        />

                        <DrawerMenu
                            iconName="cart-plus"
                            titleName="Adquirir Suscripción"
                            navigation={() => props.navigation.navigate("AdquirirSuscripcion")}
                        />


                    </View>

                </View>
            </DrawerContentScrollView>

            <View style={styles.bottomDrawerSection}>
                <DrawerClose
                    iconName="times-circle"
                    titleName="Cerrar Sesión" />
            </View>

        </View>
    );
}

function DrawerMenu(props) {
    return (
        <TouchableOpacity onPress={props.navigation}>
            <View style={styles.viewDrawerMenu}>
                <View>
                    <Icon style={styles.iconDrawerMenu} name={props.iconName} />
                </View>
                <View>
                    <Text style={styles.textDrawerMenu}> {props.titleName} </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function DrawerClose(props) {
    return (
        <TouchableOpacity onPress={() => cerrarSesion()} >
            <View style={styles.viewDrawerMenuClose}>
                <View>
                    <Icon style={styles.iconDrawerMenuClose} name={props.iconName} />
                </View>
                <View>
                    <Text style={styles.textDrawerMenuclose}> {props.titleName} </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 150,
    },
    avatar: {
        height: 80,
        width: 80,
    },
    title: {
        fontSize: 20,
        marginTop: 3,
        fontWeight: "bold",
        color: colorBotonMiTienda
    },
    caption: {
        fontSize: 14,
        fontWeight: '700',
        color: colorMarca,
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    paragraph: {
        fontWeight: "bold",
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
        justifyContent: 'center',
    },
    bottomDrawerSection: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorMarca
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    viewDrawerMenu: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    textDrawerMenu: {
        fontSize: 22,
        fontWeight: "bold",
        margin: 5,
        padding: 5,
        color: colorBotonMiTienda,
    },
    iconDrawerMenu: {
        fontSize: 22,
        fontWeight: "bold",
        margin: 5,
        padding: 5,
        color: colorBotonMiTienda,
    },
    viewDrawerMenuClose: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
    },
    textDrawerMenuclose: {
        fontSize: 22,
        fontWeight: "bold",
        margin: 5,
        padding: 5,
        color: '#fff',
    },
    iconDrawerMenuClose: {
        fontSize: 40,
        color: '#fff',
    },
});
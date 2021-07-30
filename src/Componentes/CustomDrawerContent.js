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

            <View style={{ flexDirection: "row", marginTop: 15, alignItems: 'center' }}>
              <Avatar
                rounded
                style={styles.avatar}
                size="medium"
                source={photoURL ? { uri: photoURL } : require("../../assets/avatar.jpg")}
              />
              <Text style={styles.title}>{displayName}</Text>
            </View>

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
              iconName="cart-plus"
              titleName="Mis publicaciones"
              navigation={() => props.navigation.navigate("MiTienda")}
            />

            <DrawerMenu
              iconName="file"
              titleName="Empleo"
              navigation={() => props.navigation.navigate("Vacantes")}
            />

            <DrawerMenu
              iconName="user"
              titleName="Mi Perfil"
              navigation={() => props.navigation.navigate("Perfil")}
            />

            <DrawerMenu
              iconName="plus-square"
              titleName="Oferta de empleo"
              navigation={() => props.navigation.navigate("AgregarVacante")}
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
    paddingLeft: 20,
  },
  logo: {
    width: 250,
    height: 150,
  },
  avatar: {
    height: 50,
    width: 50,
  },
  title: {
    marginLeft: 20,
    fontSize: 20,
    marginTop: 3,
    fontWeight: "bold",
    color: colorBotonMiTienda
  },
  caption: {
    fontSize: 16,
    lineHeight: 14,
    fontWeight: '700',
    color: colorMarca,
    textAlign: 'center',
    paddingTop: 15
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
    marginLeft: 7,
    marginRight: 7,
    marginTop: 3,
    marginBottom: 3,
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
    marginLeft: 7,
    marginRight: 7,
    marginTop: 3,
    marginBottom: 3,
    paddingHorizontal: 5,
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
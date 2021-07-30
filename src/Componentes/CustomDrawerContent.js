import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Icon } from "react-native-elements";

import { obtenerUsuario, cerrarsesion } from "../Utils/Acciones";
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
            <DrawerItem
              icon={() => (
                <Icon
                  name="cart-outline"
                  color={colorBotonMiTienda}
                  size={35}
                  type="material-community"
                />
              )}
              label="Tienda"
              onPress={() => {
                props.navigation.navigate("Tienda");
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon
                  name="book"
                  color={colorBotonMiTienda}
                  size={35}
                  type="material-community"
                />
              )}
              label="Directorio"
              onPress={() => {
                props.navigation.navigate("Directorio");
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon
                  name="store"
                  color={colorBotonMiTienda}
                  size={35}
                  type="material-community"
                />
              )}
              label="Mi Tienda"
              onPress={() => {
                props.navigation.navigate("MiTienda");
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon
                  name="file"
                  color={colorBotonMiTienda}
                  size={35}
                  type="material-community"
                />
              )}
              label="Vacantes"
              onPress={() => {
                props.navigation.navigate("Vacantes");
              }}
            />

            <DrawerItem
              icon={() => (
                <Icon
                  name="account-outline"
                  color={colorBotonMiTienda}
                  size={35}
                  type="material-community"
                />
              )}
              label="Mi Perfil"
              onPress={() => {
                props.navigation.navigate("Perfil");
              }}
            />

          </View>

        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={() => (
            <Icon
              name="exit-to-app"
              color={colorMarca}
              size={35}
              type="material-community"
            />
          )}
          label="Cerrar Sesión"
          onPress={() => {
            cerrarsesion();
          }}
        />
      </View>
    </View>
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
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
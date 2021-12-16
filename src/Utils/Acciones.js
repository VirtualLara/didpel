import { firebaseapp } from "./Firebase";
import { Platform } from "react-native";
import * as firebase from "firebase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import "firebase/firestore";
import uuid from "random-uuid-v4";
import { map, } from "lodash";
import { FireSQL } from "firesql";
import moment from 'moment/min/moment-with-locales'

moment.locale('es');

import { convertirFicheroBlob, sumarDias } from "./Utils";

const db = firebase.firestore(firebaseapp);
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const validarSesion = (setValidadSesion) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setValidadSesion(true);
    } else {
      setValidadSesion(false);
    }
  });
};

export const cerrarSesion = () => {
  firebase.auth().signOut();
};

export const iniciarNotificaciones = (
  notificationListener,
  responseListener
) => {
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(notification);
    }
  );

  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });
};

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

export const sendPushNotification = async (mensaje) => {
  let respuesta = false;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mensaje),
  }).then((response) => {
    respuesta = true;
  });

  return respuesta;
};

export const validarPhone = (setPhoneAuth) => {
  db.collection("Usuarios")
    .doc(obtenerUsuario().uid)
    .onSnapshot((snapshot) => {
      setPhoneAuth(snapshot.exists);
    });
};

export const enviarAutenticacionPhone = async (numero, reacaptcha) => {
  let verificationId = "";

  await firebase
    .auth()
    .currentUser.reauthenticateWithPhoneNumber(numero, reacaptcha.current)
    .then((response) => {
      verificationId = response.verificationId;
    })
    .catch((err) => console.log(err));

  return verificationId;
};

export const confirmarCodigo = async (verificationId, codigo) => {
  let resultado = false;
  const credenciales = firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    codigo
  );

  await firebase
    .auth()
    .currentUser.linkWithCredential(credenciales)
    .then((response) => (resultado = true))
    .catch((err) => {
      console.log(err);
    });

  return resultado;
};

//Esta es la funcion que obtiene el token para las push notifications
export const obtenerToken = async () => {
  let token = "";
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

export const obtenerUsuario = () => {
  return firebase.auth().currentUser;
};

export const addRegisterEspecifico = async (coleccion, doc, data) => {
  const resultado = { error: "", statusresponse: false, data: null };

  await db
    .collection(coleccion)
    .doc(doc)
    .set(data, { merge: true })
    .then((response) => {
      resultado.statusresponse = true;
    })
    .catch((err) => {
      resultado.error = err;
    });

  return resultado;
};

//Esta es la funcion que sube las fotos a firebase
export const subirImagenesBatch = async (imagenes, ruta) => {
  const imagenesURL = [];

  await Promise.all(
    map(imagenes, async (image) => {
      const blob = await convertirFicheroBlob(image);
      const ref = firebase.storage().ref(ruta).child(uuid());

      await ref.put(blob).then(async (result) => {
        await firebase
          .storage()
          .ref(`${ruta}/${result.metadata.name}`)
          .getDownloadURL()
          .then((imagenURL) => {
            imagenesURL.push(imagenURL);
          });
      });
    })
  );
  return imagenesURL;
};

export const actualizarPerfil = async (data) => {
  let respuesta = false;

  await firebase
    .auth()
    .currentUser.updateProfile(data)
    .then((response) => {
      respuesta = true;
    });

  return respuesta;
};

export const reautenticar = async (verificationId, code) => {
  let response = { statusresponse: false, data: null };

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.reauthenticateWithCredential(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const actualizarEmailFirebase = async (email) => {
  let response = { statusresponse: false };

  await firebase
    .auth()
    .currentUser.updateEmail(email)
    .then((respuesta) => {
      response.statusresponse = true;
    })
    .catch((err) => (response.statusresponse = false));

  return response;
};

export const actualizarTelefono = async (verificationId, code) => {
  let response = { statusresponse: false };

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.updatePhoneNumber(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

//Esta funcion guarda la imformacíon de los artuculos en firebase
export const addRegistro = async (coleccion, data) => {
  const resultado = { error: "", statusresponse: false };

  await db
    .collection(coleccion)
    .add(data)
    .then((response) => {
      resultado.statusresponse = true;
    })
    .catch((err) => {
      resultado.error = err;
    });

  return resultado;
};

export const listarMisProductos = async () => {
  let productos = [];

  await db
    .collection("Productos")
    .where("usuario", "==", obtenerUsuario().uid)
    .where('fechavigencia', 'in', [
      moment(new Date()).format("MMM Do YY"),
      moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 2)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 3)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 4)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 5)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 6)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 7)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 8)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 9)).format("MMM Do YY"),
    ])
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
    })
    .catch((err) => {
      console.log("Error");
    });

  return productos;
};

export const actualizarRegistro = async (coleccion, documento, data) => {
  let response = { statusresponse: false };

  await db
    .collection(coleccion)
    .doc(documento)
    .update(data)
    .then((result) => (response.statusresponse = true))
    .catch((err) => console.log(err));

  return response;
};

export const eliminarProducto = async (coleccion, documento) => {
  let response = { status: false };

  await db
    .collection(coleccion)
    .doc(documento)
    .delete()
    .then((result = response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const obtenerRegistroXID = async (coleccion, documento) => {
  let response = { statusresponse: false, data: null };

  await db
    .collection(coleccion)
    .doc(documento)
    .get()
    .then((result) => {
      const producto = result.data();
      producto.id = result.id;
      response.data = producto;
      response.statusresponse = true;
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const listarProductos = async () => {
  const productosList = [];
  let index = 0;

  await db
    .collection("Productos")
    .where("status", "==", 1)
    .where('fechavigencia', 'in', [
      moment(new Date()).format("MMM Do YY"),
      moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 2)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 3)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 4)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 5)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 6)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 7)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 8)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 9)).format("MMM Do YY"),
    ])
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;

        productosList.push(producto);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of productosList) {
    const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
    productosList[index].usuario = usuario.data;
    index++;
  }

  return productosList;
};

export const listarProductosMiColonia = async () => {

  const productosList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let colonia = datosUSer.data.colonia;
  let ciudad = datosUSer.data.ciudad;

  if (colonia) {
    await db
      .collection("Productos")
      .where("status", "==", 1)
      .where('fechavigencia', 'in', [
        moment(new Date()).format("MMM Do YY"),
        moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 2)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 3)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 4)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 5)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 6)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 7)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 8)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 9)).format("MMM Do YY"),
      ])
      .where('colonia', '==', `${colonia}`)
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const producto = doc.data();
          producto.id = doc.id;

          productosList.push(producto);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of productosList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      productosList[index].usuario = usuario.data;
      index++;
    }

    return productosList;

  } else {

    return productosList;

  }


};

export const listarProductosMiCiudad = async () => {

  const productosList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let ciudad = datosUSer.data.ciudad;

  if (ciudad) {
    await db
      .collection("Productos")
      .where("status", "==", 1)
      .where('fechavigencia', 'in', [
        moment(new Date()).format("MMM Do YY"),
        moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 2)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 3)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 4)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 5)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 6)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 7)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 8)).format("MMM Do YY"),
        moment(sumarDias(new Date(), 9)).format("MMM Do YY"),
      ])
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const producto = doc.data();
          producto.id = doc.id;

          productosList.push(producto);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of productosList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      productosList[index].usuario = usuario.data;
      index++;
    }

    return productosList;

  } else {

    return productosList;

  }


};

export const listarProductosPorCategoria = async (categoria) => {
  const productosList = [];
  let index = 0;

  await db
    .collection("Productos")
    .where("status", "==", 1)
    .where("categoria", "==", categoria)
    //.where('fechavigencia', '==', (new Date().getTime).toString())
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;

        productosList.push(producto);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of productosList) {
    const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
    productosList[index].usuario = usuario.data;
    index++;
  }

  return productosList;
};

export const listarProductosPorCategoriaColonia = async (categoria) => {
  const productosList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let colonia = datosUSer.data.colonia;
  let ciudad = datosUSer.data.ciudad;

  if (colonia) {
    await db
      .collection("Productos")
      .where("status", "==", 1)
      .where("categoria", "==", categoria)
      .where('colonia', '==', `${colonia}`)
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const producto = doc.data();
          producto.id = doc.id;

          productosList.push(producto);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of productosList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      productosList[index].usuario = usuario.data;
      index++;
    }

    return productosList;

  } else {

    return productosList;

  }

};

export const listarProductosPorCategoriaCiudad = async (categoria) => {
  const productosList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let ciudad = datosUSer.data.ciudad;

  if (ciudad) {
    await db
      .collection("Productos")
      .where("status", "==", 1)
      .where("categoria", "==", categoria)
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const producto = doc.data();
          producto.id = doc.id;

          productosList.push(producto);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of productosList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      productosList[index].usuario = usuario.data;
      index++;
    }

    return productosList;

  } else {

    return productosList;

  }

};

export const Buscar = async (query) => {
  let result = [];

  await fireSQL.query(`${query}`).then((response) => {
    result = response;
  });

  return result;
};

export const listarVacantes = async () => {
  const vacantesList = [];
  let index = 0;

  await db
    .collection("Vacantes")
    .where("status", "==", 1)
    //.where('fechavigencia', '==', moment(new Date()).subtract(10, 'days').calendar())
    //.where('fechavigencia', '==', moment(sumarDias(new Date(), 1)).subtract(10, 'days').calendar())
    .where('fechavigencia', 'in', [
      moment(new Date()).format("MMM Do YY"),
      moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
    ])
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const vacante = doc.data();
        vacante.id = doc.id;

        vacantesList.push(vacante);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of vacantesList) {
    const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
    vacantesList[index].usuario = usuario.data;
    index++;
  }

  return vacantesList;
};

export const listarVacantesMiColonia = async () => {
  const vacantesList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let colonia = datosUSer.data.colonia;
  let ciudad = datosUSer.data.ciudad;

  if (colonia) {
    await db
      .collection("Vacantes")
      .where("status", "==", 1)
      .where('fechavigencia', 'in', [
        moment(new Date()).format("MMM Do YY"),
        moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
      ])
      .where('colonia', '==', `${colonia}`)
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const vacante = doc.data();
          vacante.id = doc.id;

          vacantesList.push(vacante);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of vacantesList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      vacantesList[index].usuario = usuario.data;
      index++;
    }

    return vacantesList;

  } else {

    return vacantesList;

  }

};

export const listarVacantesMiCiudad = async () => {
  const vacantesList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let ciudad = datosUSer.data.ciudad;

  if (ciudad) {
    await db
      .collection("Vacantes")
      .where("status", "==", 1)
      .where('fechavigencia', 'in', [
        moment(new Date()).format("MMM Do YY"),
        moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
      ])
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const vacante = doc.data();
          vacante.id = doc.id;

          vacantesList.push(vacante);
        });
      })
      .catch((err) => console.log(err));

    for (const registro of vacantesList) {
      const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
      vacantesList[index].usuario = usuario.data;
      index++;
    }

    return vacantesList;

  } else {

    return vacantesList;

  }

};

export const setMensajeNotificacion = (token, titulo, body, data) => {
  const mensaje = {
    to: token,
    sound: "default",
    title: titulo,
    body: body,
    data: { data: data },
  };

  return mensaje;
};

export const listarNotificacionesPendientes = async () => {
  let respuesta = { statusresponse: false, data: [] };

  let index = 0;

  await db
    .collection("Notificaciones")
    .where("receiver", "==", obtenerUsuario().uid)
    .where("visto", "==", 0)
    .get()
    .then((response) => {
      let datos;

      response.forEach((doc) => {
        datos = doc.data();
        datos.id = doc.id;
        respuesta.data.push(datos);
      });
      respuesta.statusresponse = true;
    });

  for (const notificacion of respuesta.data) {
    const usuario = await obtenerRegistroXID("Usuarios", notificacion.sender);
    respuesta.data[index].sender = usuario.data;
    index++;
  }
  return respuesta;
};

export const listarNotificacionesLeidas = async () => {
  let respuesta = { statusresponse: false, data: [] };

  let index = 0;

  await db
    .collection("Notificaciones")
    .where("receiver", "==", obtenerUsuario().uid)
    .where("visto", "==", 1)
    //.orderBy("fechacreacion", 'desc')
    .get()
    .then((response) => {
      let datos;

      response.forEach((doc) => {
        datos = doc.data();
        datos.id = doc.id;
        respuesta.data.push(datos);
      });
      respuesta.statusresponse = true;
    });

  for (const notificacion of respuesta.data) {
    const usuario = await obtenerRegistroXID("Usuarios", notificacion.sender);
    respuesta.data[index].sender = usuario.data;
    index++;
  }
  return respuesta;
};

export const listarAnunciantes = async () => {
  const anunciantesList = [];
  let index = 0;

  await db
    .collection("Usuarios")
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const anunciante = doc.data();
        anunciante.id = doc.id;

        anunciantesList.push(anunciante);
      });
    })
    .catch((err) => console.log(err));
  return anunciantesList;

};

export const listarAnunciantesMiColonia = async () => {
  const anunciantesList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let colonia = datosUSer.data.colonia;
  let ciudad = datosUSer.data.ciudad;

  if (colonia) {
    await db
      .collection("Usuarios")
      .where('colonia', '==', `${colonia}`)
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const anunciante = doc.data();
          anunciante.id = doc.id;

          anunciantesList.push(anunciante);
        });
      })
      .catch((err) => console.log(err));

    return anunciantesList;

  } else {

    return anunciantesList;

  }

};

export const listarAnunciantesMiCiudad = async () => {
  const anunciantesList = [];
  let index = 0;

  let user = obtenerUsuario().uid;
  let datosUSer = await obtenerRegistroXID('Usuarios', user);
  let ciudad = datosUSer.data.ciudad;

  if (ciudad) {
    await db
      .collection("Usuarios")
      .where('ciudad', '==', `${ciudad}`)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const anunciante = doc.data();
          anunciante.id = doc.id;

          anunciantesList.push(anunciante);
        });
      })
      .catch((err) => console.log(err));

    return anunciantesList;

  } else {

    return anunciantesList;

  }

};

export const listarProductosPorAnunciante = async (anunciante) => {
  const productosList = [];
  let index = 0;

  await db
    .collection("Productos")
    .where("status", "==", 1)
    .where('fechavigencia', 'in', [
      moment(new Date()).format("MMM Do YY"),
      moment(sumarDias(new Date(), 1)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 2)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 3)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 4)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 5)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 6)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 7)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 8)).format("MMM Do YY"),
      moment(sumarDias(new Date(), 9)).format("MMM Do YY"),
    ])
    .where('usuario', '==', `${anunciante}`)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;

        productosList.push(producto);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of productosList) {
    const usuario = await obtenerRegistroXID("Usuarios", registro.usuario);
    productosList[index].usuario = usuario.data;
    index++;
  }

  return productosList;
};
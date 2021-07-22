import { firebaseapp } from './Firebase';
import { Platform } from 'react-native';
import * as firebase from 'firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import 'firebase/firestore';
import uuid from 'random-uuid-v4';
import { map } from 'lodash';
import { FireSQL } from 'firesql';

import { convertirFicheroBlob } from './Utils';

const db = firebase.firestore(firebaseapp);
const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' })

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    })
});

export const validarSesion = (setValidadSesion) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setValidadSesion(true);
        } else {
            setValidadSesion(false);
        }
    })
};

export const cerrarSesion = () => {
    firebase.auth().signOut();
};

export const validarPhone = (setPhoneAuth) => {
    db.collection('Usuarios')
        .doc(obtenerUsuario().uid)
        .onSnapshot(snapshot => {
            setPhoneAuth(snapshot.exists);
        });
};

export const enviarAutenticacionPhone = async (numero, reacaptcha) => {
    let verificationId = '';

    await firebase
        .auth()
        .currentUser.reauthenticateWithPhoneNumber(numero, reacaptcha.current)
        .then((response) => {
            verificationId = response.verificationId;
        })
        .catch(err => console.log(err));

    return verificationId;
};

export const confirmarCodigo = async (verificationId, codigo) => {
    let resultado = false;
    const credenciales = firebase.auth.PhoneAuthProvider.credential(verificationId, codigo);

    await firebase
        .auth()
        .currentUser
        .linkWithCredential(credenciales)
        .then((response) => (resultado = true))
        .catch((err) => {
            console.log(err)
        });

    return resultado;
};

//Esta es la funcion que obtiene el token para las push notifications
export const obtenerToken = async () => {
    let token = '';
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
};

export const obtenerUsuario = () => {
    return firebase.auth().currentUser;
};

export const addRegisterEspecifico = async (coleccion, doc, data) => {
    const resultado = { error: '', statusresponse: false, data: null };

    await db
        .collection(coleccion)
        .doc(doc)
        .set(data, { merge: true })
        .then(response => {
            resultado.statusresponse = true;
        })
        .catch((err) => {
            resultado.error = err;
        })

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
                    })
            })
        })
    )
    return imagenesURL;
};

export const actualizarPerfil = async (data) => {
    let respuesta = false;

    await firebase.auth().currentUser.updateProfile(data)
        .then((response) => {
            respuesta = true;
        });

    return respuesta;

}

export const reautenticar = async (verificationId, code) => {
    let response = { statusresponse: false, data: null };

    const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificationId, code);

    await firebase
        .auth()
        .currentUser
        .reauthenticateWithCredential(credenciales)
        .then(resultado => response.statusresponse = true)
        .catch(err => {
            console.log(err);
        })

    return response;

}

export const actualizarEmailFirebase = async (email) => {
    let response = { statusresponse: false }

    await firebase.auth().currentUser.updateEmail(email)
        .then((respuesta) => {
            response.statusresponse = true;
        })
        .catch(err => response.statusresponse = false);

    return response;
}

export const actualizarTelefono = async (verificationId, code) => {
    let response = { statusresponse: false }

    const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificationId, code);

    await firebase
        .auth()
        .currentUser.updatePhoneNumber(credenciales)
        .then((resultado) => (response.statusresponse = true))
        .catch((err) => {
            console.log(err)
        });

    return response;
}

//Esta funcion guarda la imformacíon de los artuculos en firebase
export const addRegistro = async (coleccion, data) => {
    const resultado = { error: '', statusresponse: false };

    await db
        .collection(coleccion)
        .add(data)
        .then(response => {
            resultado.statusresponse = true;
        })
        .catch((err) => {
            resultado.error = err;
        })

    return resultado;
}

export const listarMisProductos = async () => {
    let productos = [];

    await db
        .collection('Productos')
        .where('usuario', '==', obtenerUsuario().uid)
        //.where('status', '==', 1)
        .get()
        .then(response => {
            response.forEach((doc) => {
                const producto = doc.data();
                producto.id = doc.id;
                productos.push(producto)
            })
        })
        .catch(err => { console.log('Error') })

    return productos;

}

export const actualizarRegistro = async (coleccion, documento, data) => {

    let response = { statusresponse: false }

    await db.
        collection(coleccion).
        doc(documento)
        .update(data)
        .then((result) => response.statusresponse = true)
        .catch(err => console.log(err))

    return response;

}

export const eliminarProducto = async (coleccion, documento) => {
    let response = { status: false }

    await db.collection(coleccion).doc(documento)
        .delete()
        .then(result = response.statusresponse = true)
        .catch(err => { console.log(err) })

    return response;
}

export const obtenerRegistroXID = async (coleccion, documento) => {
    let response = { statusresponse: false, data: null }

    await db
        .collection(coleccion)
        .doc(documento)
        .get()
        .then(result => {
            const producto = result.data();
            producto.id = result.id;
            response.data = producto;
            response.statusresponse = true;
        })
        .catch(err => { console.log(err) })

    return response;
}

export const listarProductos = async () => {
    const productosList = [];
    let index = 0;

    await db.collection('Productos')
        .where('status', '==', 1)
        //.where('fechavigencia', '==', (new Date().getTime).toString())
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const producto = doc.data();
                producto.id = doc.id;

                productosList.push(producto)
            })
        })
        .catch(err => console.log(err))

    for (const registro of productosList) {

        const usuario = await obtenerRegistroXID('Usuarios', registro.usuario)
        productosList[index].usuario = usuario.data;
        index++;
    }

    return productosList;

}

export const listarProductosPorCategoria = async (categoria) => {

    const productosList = [];
    let index = 0;

    await db.collection('Productos')
        .where('status', '==', 1)
        .where('categoria', '==', categoria)
        //.where('fechavigencia', '==', (new Date().getTime).toString())
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const producto = doc.data();
                producto.id = doc.id;

                productosList.push(producto)
            })
        })
        .catch(err => console.log(err))

    for (const registro of productosList) {
        const usuario = await obtenerRegistroXID('Usuarios', registro.usuario)
        productosList[index].usuario = usuario.data;
        index++;
    }

    return productosList;

}

export const Buscar = async (search) => {
    let productos = [];

    await fireSQL
        .query(`SELECT * FROM Productos WHERE titulo LIKE '${search}%' OR descripcion LIKE '${search}%' `)
        //.query(`SELECT * FROM Productos WHERE descripcion IN ( '${search}')`)
        .then((response) => {
            productos = response;
        });

    return productos;
}
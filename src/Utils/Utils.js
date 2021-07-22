import * as ImagePicker from 'expo-image-picker';

export const validaremail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
        return false;
    } else {
        return true;
    }
};

export const cargarImagen = async (array) => {
    let imgResponse = { status: false, imagen: '' }

    const statusPermiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (statusPermiso === 'denied') {
        alert('Debe otorgar el acceso para cargar las imágenes.')
    } else {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: array,
            //quality: 1,
        });

        if (!result.cancelled) {
            imgResponse = { status: true, imagen: result.uri };
        }
    }
    return imgResponse;
};

export const convertirFicheroBlob = async (rutaFisica) => {
    const fichero = await fetch(rutaFisica);
    const blob = await fichero.blob();
    return blob;
};

export const sumarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

export function formatoMoneda(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
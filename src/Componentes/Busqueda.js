import { upperCase } from 'lodash';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Buscar } from '../Utils/Acciones';

export default function Busqueda(props) {

  const { setList, actualizar, setSearch, search, setMensajes, placeholder, query } = props;

  useEffect(() => {

    let resultado = [];

    if (search) {
      (async () => {
        resultado = await Buscar(query);
        setList(resultado);

        if (resultado.length === 0) {
          setMensajes('Nose encontraron resultados para ' + search)
        }
      })()
    }
  }, [search])

  return (
    <SearchBar
      placeholder={placeholder}
      containerStyle={{ backgroundColor: 'transparent', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
      inputContainerStyle={{ backgroundColor: '#fff', alignItems: 'center' }}
      inputStyle={{ fontFamily: 'Roboto', fontSize: 14 }}
      onChangeText={(text) => setSearch(text)}
      value={search}
      onClear={() => {
        setSearch('');
        setList([]);
        actualizar()
      }}
    />
  )
}
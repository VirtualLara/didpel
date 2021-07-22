import React from 'react';
import { View, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { size } from 'lodash';

import { colorBotonMiTienda, colorMarca } from '../Utils/colores';

export default function CarouselImages(props) {

  const { data, height, width, activeSlide, setActiveSlide } = props;

  const renderItem = ({ item }) => {
    return (
      <View style={{ width, height }} >
        <Image
          style={{ width, height: '92%' }}
          source={{ uri: item }}
          resizeMode='stretch'
        />
      </View>
    )
  }

  return (
    <View>
      <Carousel
        layout={'default'}
        data={data}
        sliderWidth={width}
        itemWidth={width}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index)}
      />

      <Paginacion data={data} activeSlide={activeSlide} />

    </View>
  )
}

function Paginacion(props) {

  const { data, activeSlide } = props;

  return (
    <Pagination
      dotsLength={size(data)}
      activeDotIndex={activeSlide}
      containerStyle={{
        backgroundColor: 'transparent',
        zIndex: 1,
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center'
      }}
      dotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: colorBotonMiTienda,
      }}
      inactiveDotStyle={{
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: colorMarca,
      }}
      inactiveDotOpacity={0.6}
      inactiveDotScale={0.6}
    />
  )
}
import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  fourImages: {
    height: '50%',
    width: '100%'
  },
  twoImages: {
    height: '100%',
    width: '50%'
  }
};
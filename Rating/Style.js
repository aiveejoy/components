import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  modal: {
    backgroundColor: Color.gray
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
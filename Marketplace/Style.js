import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  ScrollView: {
  },
  MainContainer: {
    flex: 1
  },
  TextContainer: {
    width: width
  },
  imageHolder: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  imageThumbnail: {
    width: width - 20,
    height: width - 20
  },
  iconThumbnail: width / 2,
  iconThumbnailStyle: {
    width: width,
    height: width,
    color: Color.gray,
    alignItems: 'center',
    justifyContent: 'center'
  }
}
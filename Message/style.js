import {StyleSheet, Dimensions} from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  CardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: BasicStyles.standardBorderRadius,
    padding: 10,
    height: '100%'
  },
  description: {
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  descriptionText: {
    fontSize: BasicStyles.standardFontSize,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#FFFFFF',
  },
}


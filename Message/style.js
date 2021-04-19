import {StyleSheet, Dimensions} from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
export default {
  CardContainer: {
    width: width - 30,
    borderRadius: BasicStyles.standardBorderRadius,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 5,
    padding: 10,
    marginTop: '40%'
  },
  description: {
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  descriptionText: {
    fontSize: BasicStyles.standardFontSize,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#FFFFFF',
  },
}


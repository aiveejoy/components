import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  ScrollView: {
    flex: 1
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Color.white,
    zIndex: 0
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  option: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Color.lightGray
  },
  optionContainer: {
    position: 'absolute',
    right: 10,
    top: 60,
    zIndex: 1,
    backgroundColor: Color.white,
    padding: 10,
    borderWidth: 1,
    borderColor: Color.lightGray,
    borderRadius: 10
  }
}
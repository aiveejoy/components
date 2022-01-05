import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  centeredView: {
    flex: 1,
    marginTop: 10,
    alignItems: "center",
  },
  modalView: {
    width: width,
    height: height / 2
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width
  },
  textInput: {
    borderColor: Color.gray,
    borderWidth: .5,
    borderRadius: 15,
    width: '90%',
    marginTop: 10,
    textAlignVertical: 'top'
  },
  button: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40
  }
}
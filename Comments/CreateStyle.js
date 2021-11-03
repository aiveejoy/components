import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)
export default {
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'rgba(0.2, 0.2, 0, 0.2)',
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width - 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: BasicStyles.elevation,
    borderWidth: .3,
    borderColor: Color.gray,
    height: height / 2
  },
  container: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  textInput: {
    borderColor: Color.gray,
    borderWidth: .5,
    borderRadius: 15,
    width: '90%',
    marginTop: 10,
    height: 100
  },
  button: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 35
  }
}
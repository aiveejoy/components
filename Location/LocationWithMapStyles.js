import {Color} from 'common';
import {Dimensions} from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  ScrollView: {
    padding: 10,
  },
  MainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  TextContainer: {
    flex: 1,
  },
  Card: {
    borderRadius: 10,
    width: width - 20,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Color.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberText: {
    color: Color.white,
    fontSize: 30,
  },
  btn: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    marginLeft: '5%',
  },
  titleTextSummary: {
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  normalText: {
    fontSize: 12,
    color: Color.gray,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width,
    height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 45,
    width: 45,
    marginBottom: -50,
  },
  icon_claw: {
    position: 'absolute',
    top: 2,
    bottom: 0,
    left: width / 2 - 16,
    right: width / 2 - 16,
    width: 32,
    height: 6,
  },
  buttonPicked: {
    justifyContent: 'center',
    height: 35,
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: '#FF5B04',
    borderWidth: 1,
  },

  notPicked: {
    justifyContent: 'center',
    height: 35,
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
};

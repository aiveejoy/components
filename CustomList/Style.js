import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
export default {
  ScrollView: {
    flex: 1,
    height: height
  },
  Separator: {
    height: 0.5,
    width: width,
    backgroundColor: Color.gray
  },
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  container: {
    flex: 1,
  },
  containerHolder: {
    flexDirection: 'row'
  },
  titleContainer: {
    width: width - 50
  },
  titleLink: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    width: 100,
    color: Color.primary,
    width: width - 50
  },
  titleUnLink: {
    fontSize: 14,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    width: 100,
    color: Color.danger,
    width: width - 50
  },
  squareCOntainer: {
    width: 50
  },
  square: {
    height: 30,
    width: 30,
    borderRadius: 5,
    borderColor: Color.gray,
    borderWidth: 1,
    marginTop: 15,
    marginLeft: 15
  }, 
  squareActive: {
    height: 30,
    width: 30,
    borderRadius: 5,
    backgroundColor: Color.primary,
    marginTop: 15,
    marginLeft: 15
  }
}
import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  ScrollView: {
    padding: 10
  },
  ScrollViewGroup: {
  },
  MainContainer: {
    width: '100%'
  },
  text: {
    color: Color.normalGray
  },
  btn: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
  },
  Separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: Color.lightGray
  },
  formControl: {
    height: 50,
    width: '80%',
  },
  messageTextRight: {
    backgroundColor: Color.primary,
    color: Color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: '30%',
    overflow: 'hidden'
  },
  messageTextRightIOS: {
    color: Color.white,
    textAlign: 'left'
  },
  messageTextLeft: {
    backgroundColor: Color.primary,
    color: Color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: '30%',
  },
  messageTextLeftIOS: {
    color: Color.white,
    textAlign: 'right'
  },
  dateText: {
    color: Color.gray,
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 5
  },
  messageImage: {
    width: 100,
    height: 100
  },
  dateTextLeft: {
    color: Color.gray,
    fontSize: 11,
    paddingTop: 5,
    paddingBottom: 5
  },
  templateText: {
    color: Color.primary,
    fontSize: 11,
    textAlign: 'center'
  },
  templateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    color: Color.primary,
    backgroundColor: Color.white,
    borderColor: Color.primary,
    borderWidth: 1
  },
}
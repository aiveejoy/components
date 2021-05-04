import { StyleSheet, Dimensions } from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import Color from 'common/Color';
const styles = StyleSheet.create({
  CreateTicketContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: '4%',
  },
  InputContainer: {
    width: '90%',
    marginTop: 5
  },
  Dropdown: {
    borderWidth: .3,
    borderColor: Color.gray,
    borderRadius: 25,
    justifyContent: 'center',
    height: 50,
    paddingBottom: 20,
    width: width - 47
  },
  TicketButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  CustomButtonContainer: {
    borderRadius: 10,
    right: 7,
  },
  ButtonTextContainer: {
    paddingVertical: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonTextStyle: {
    textAlign: 'center',
  },
  TicketInputInputContainer: {
    marginTop: '2%',
    width: '100%',
  },
  TicketInputTitleContainer: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  TicketInputTitleTextStyle: {
    fontSize: 15,
  },
  TextInputContainer: {
    height: 60,
    marginTop: '2%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  Image: {
    height: 100,
    width: 100,
  },
  CardContainer: {
    width: (width - 50),
    borderRadius: BasicStyles.standardBorderRadius,
    padding: 10,
    marginBottom: 10
  },
  title: {
    alignItems: 'center',
    paddingTop: '8%',
    paddingBottom: '8%',
    textAlign: 'center'
  },
  titleText: {
    fontSize: BasicStyles.standardFontSize,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  }
});

export default styles;

import { StyleSheet, Dimensions } from 'react-native';
import {BasicStyles} from 'common';
const width = Math.round(Dimensions.get('window').width);
import Color from 'common/Color';
const styles = StyleSheet.create({
  CreateTicketContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: '4%',
    flex: 1,
    padding: 15
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
    alignItems: 'center'
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
    marginBottom: 5
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
    width: width / 2,
    borderRadius: BasicStyles.standardBorderRadius,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '40%',
    paddingBottom: '10%',
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

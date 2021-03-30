import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faQrcode, faBars} from '@fortawesome/free-solid-svg-icons';
import UpdateTicket from 'components/Support/UpdateTicket';
import {NavigationActions} from 'react-navigation';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Support',
    });
    this.props.navigationProps.dispatch(navigateAction);
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View
        style={{
          height: 45,
          width: 45,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.back();
          }}
          style={{
            width: '16.5%',
            alignItems: 'center',
            marginLeft: '0.5%',
          }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{color: theme ? theme.primary : Color.primary }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

let HeaderOptionsConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderOptions);

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

const UpdateTicketStack = createStackNavigator({
  supportScreen: {
    screen: UpdateTicket,
    navigationOptions: ({navigation}) => ({
      title: 'Ticket Details',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation}/>,
      drawerLabel: 'Ticket Details',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#4c4c4c',
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateTicketStack);

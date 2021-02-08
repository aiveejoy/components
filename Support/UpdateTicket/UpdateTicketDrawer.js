import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faQrcode, faBars} from '@fortawesome/free-solid-svg-icons';
import UpdateTicket from 'components/Support/UpdateTicket';
import {NavigationActions} from 'react-navigation';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {BasicStyles} from 'common';
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
            size={30}
            style={{color: '#3F0050'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

const UpdateTicketStack = createStackNavigator({
  supportScreen: {
    screen: UpdateTicket,
    navigationOptions: ({navigation}) => ({
      title: 'UpdateTicket',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      drawerLabel: 'Update Ticket',
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

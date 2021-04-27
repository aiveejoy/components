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
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{Color: theme ? theme.primary : Color.primary }}
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
      drawerLabel: 'Ticket Details',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateTicketStack);

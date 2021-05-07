import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import CreateTicket from 'components/Support/createTicket';
import {connect} from 'react-redux';
import { BasicStyles, Color } from 'common';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.navigate('drawerStack');
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
  return {
    logout: () => dispatch(actions.logout()),
  };
};

const CreateTicketStack = createStackNavigator({
  createTicketScreen: {
    screen: CreateTicket,
    navigationOptions: ({navigation}) => ({
      title: 'Create Ticket',
      drawerLabel: 'Create Ticket',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTicketStack);

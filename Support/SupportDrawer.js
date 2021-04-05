import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faQrcode, faBars} from '@fortawesome/free-solid-svg-icons';
import Support from 'components/Support';
import {NavigationActions} from 'react-navigation';
import {BasicStyles} from 'common';
import {connect} from 'react-redux';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';

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
    // const { theme } = this.props.state;
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
            // style={{color: theme ? theme.primary : Color.primary }}
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

const SupportStack = createStackNavigator({
  supportScreen: {
    screen: Support,
    navigationOptions: ({navigation}) => ({
      title: 'Support',
      headerLeft: <HeaderOptions navigationProps={navigation} />,
      drawerLabel: 'Support',
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
)(SupportStack);

import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LocationAutoComplete from 'components/Location/index.js';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

class HeaderOptions extends Component {
  constructor(props){
    super(props);
  }
  back = () => {
    const { setPreviousRoute } = this.props;
    const { previousRoute } = this.props.state;
    if(previousRoute == null){
      return
    }
    setPreviousRoute(null)
    this.props.navigationProps.navigate(previousRoute);
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon icon={ faChevronLeft } size={BasicStyles.iconSize} style={BasicStyles.iconStyle}/>
        </TouchableOpacity>
      </View>
    );
  }
}
 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setPreviousRoute: (previousRoute) => dispatch(actions.setPreviousRoute(previousRoute))
  };
};


let HeaderOptionsState = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderOptions);

const LocationStack = createStackNavigator({
  locationScreen: {
    screen: LocationAutoComplete, 
    navigationOptions: ({ navigation }) => ({
      title: 'Add Location',
      headerLeft: <HeaderOptionsState navigationProps={navigation} />,
      drawerLabel: 'Add Location',
      headerStyle: {
        backgroundColor: Color.primary,
      },
      headerTintColor: '#fff',
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationStack);
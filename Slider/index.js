
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './Style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { Helper } from 'common';
class Slider extends Component {
  constructor(props){
    super(props);
  }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  logoutAction(){
    //clear storage
    const { logout } = this.props;
    logout();
    this.props.navigation.navigate('loginStack');
  }

  render () {
    const { state } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            {state.user != null ? <Text style={styles.sectionHeadingStyle}>
              Hi {state.user.username}!
            </Text> : null}
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={() => this.logoutAction()}>
              Logout
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>A product of {Helper.company}</Text>
        </View>
      </View>
    );
  }
}

Slider.propTypes = {
  navigation: PropTypes.object
};

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider);

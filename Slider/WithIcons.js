
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './Style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Helper, BasicStyles, Color } from 'common';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

class Slider extends Component {
  constructor(props){
    super(props);
  }
  navigateToScreen = (route) => {
    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    // const { setActiveRoute } = this.props;
    // setActiveRoute(null)
  }

  logoutAction(){
    //clear storage
    const { logout, setActiveRoute } = this.props;
    logout();
    // setActiveRoute(null)
    this.props.navigation.navigate('loginStack');
  }

  render () {
    const { user, theme } = this.props.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            {user != null ? (
                <View style={[styles.sectionHeadingStyle, {
                  backgroundColor: theme ? theme.primary : Color.primary,
                }]}>
                  {
                    user.account_profile != null && user.account_profile.url != null && (
                      <Image
                        source={{uri: Config.BACKEND_URL  + user.account_profile.url}}
                        style={[BasicStyles.profileImageSize, {
                          height: 100,
                          width: 100,
                          borderRadius: 50
                        }]}/>
                    )
                  }

                  {
                    (user.account_profile == null || (user.account_profile != null && user.account_profile.url == null)) && (
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        size={100}
                        style={{
                          color: Color.white
                        }}
                      />
                    )
                  }
            
                  <Text  style={{
                    color: Color.white,
                    fontWeight: 'bold',
                    fontSize: 16
                  }}>
                    Hi {user.username}!
                  </Text>
                </View>
              ) : 
              <View style={[styles.sectionHeadingStyle, {
                alignItems: 'flex-start',
                backgroundColor: theme ? theme.primary : Color.primary
              }]}>
                <TouchableOpacity
                  onPress={() => this.navigateToScreen('loginStack')}>
                  <Text style={{
                    color: Color.white,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 20
                  }}>
                    Login or register
                  </Text>
                </TouchableOpacity>
              </View>
              }
            {(user != null && Helper.DrawerMenu.length > 0) &&
              Helper.DrawerMenu.map((item, index) => {
                return(
                <View style={[styles.navSectionStyleNoBorder, {
                  paddingLeft: 15
                }]} key={index}>
                  <TouchableOpacity
                    onPress={() => this.navigateToScreen(item.route)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <FontAwesomeIcon icon={item.icon} style={[item.iconStyle, {
                        color: theme ? theme.primary : Color.primary
                      }]}/>
                      <Text style={styles.navItemStyle}>
                        {item.title}
                      </Text>
                  </TouchableOpacity>
                </View>)
              })
            }
            {(user == null && Helper.DrawerMenuLogout.length > 0) &&
              Helper.DrawerMenuLogout.map((item, index) => {
                return(
                <View style={[styles.navSectionStyleNoBorder, {
                  paddingLeft: 15
                }]} key={index}>
                  <TouchableOpacity
                    onPress={() => this.navigateToScreen(item.route)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <FontAwesomeIcon icon={item.icon}  style={[item.iconStyle, {
                        color: theme ? theme.primary : Color.primary
                      }]}/>
                      <Text style={styles.navItemStyle}>
                        {item.title}
                      </Text>
                  </TouchableOpacity>
                </View>)
              })
            }
            <View style={[styles.navSectionStyleBorderTop, {
              borderTopColor: theme ? theme.primary : Color.primary
            }]}>
              {Helper.DrawerMenuBottom.length > 0 &&
                Helper.DrawerMenuBottom.map((item, index) => {
                  return(
                  <View style={[styles.navSectionStyleNoBorder, {
                    flexDirection: 'row',
                    alignItems: 'center'
                  }]} key={index}>
                    <Text style={styles.navItemStyle} onPress={() => this.navigateToScreen(item.route)}>
                      {item.title}
                    </Text>
                  </View>)
                })
              }
              {
                user !== null && (
                  <View style={styles.navSectionStyleNoBorder}>
                    <Text style={[styles.navItemStyle, {
                      color: theme ? theme.primary : Color.primary,
                      fontWeight: 'bold'
                    }]} onPress={() => this.logoutAction()}>
                      Logout
                    </Text>
                  </View>
                )
              }
              
            </View>
          </View>
        </ScrollView>
        {
          /*
            <View style={styles.footerContainer}>
              <Text>A product of {Helper.company}</Text>
            </View> 
          */
        }
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
    logout: () => dispatch(actions.logout()),
    setActiveRoute: (route) => dispatch(actions.setActiveRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Slider);

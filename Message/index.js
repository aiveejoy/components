import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './style.js';
import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
import {connect} from 'react-redux';
const height = Math.round(Dimensions.get('window').height);
class Message extends Component{
  
  constructor(props){
    super(props);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  render () {
    const { theme } = this.props.state;
    return (
      <View style={{
        ...styles.CardContainer,
        backgroundColor: theme ? theme.primary : Color.primary,
        borderWidth: 1,
        borderColor: theme ? theme.primary : Color.primary,
        alignItems: 'center',
        height: height - 500
        }}>
          <View>
            <Image source={require('assets/Partners.png')} style={{
              height: 150,
              width: 150,
              marginRight: '15%',
              // marginLeft: '-10%',
              position: 'absolute',
              marginTop: '7%'
            }}/>
          </View>
          <View style={[styles.description, {
            paddingTop: '12%',
            paddingRight: '40%'
          }]}>
            <Text
              style={{
                ...styles.descriptionText,
                fontSize: BasicStyles.titleText.fontSize,
                color: Color.white
              }}>
              {this.props.message}
            </Text>
          </View>
          <TouchableOpacity
          onPress={() => this.redirect('createRequestStack')}
          style={{
              top: '11%',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 20,
              marginRight: '45%',
              color: Color.primary,
              backgroundColor: Color.white,
              borderColor: theme ? theme.primary : Color.primary,
              borderWidth: 1,
              width: '50%'
          }}
          >
          <Text style={{
              color:theme ? theme.primary : Color.primary,
              fontSize: 11,
              textAlign: 'center'
          }}>Create Request</Text>
          </TouchableOpacity>
            
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
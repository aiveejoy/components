import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './style.js';
import { Color, BasicStyles, Helper } from 'common';
import { Dimensions } from 'react-native';
import {connect} from 'react-redux';
class Message extends Component{
  
  constructor(props){
    super(props);
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  };

  validate = () => {
    Alert.alert(
      'Message',
      'In order to Create Request, Please Verify your Account.',
      [
        {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  render () {
    const { theme, user } = this.props.state;
    return (
      <View>
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            borderRadius: BasicStyles.standardBorderRadius,
            padding: 10,
            marginTop: 20,
            backgroundColor: theme ? theme.primary : Color.primary,
            borderWidth: 1,
            borderColor: theme ? theme.primary : Color.primary,
            flexDirection: 'row'
          }}>
            <View style={{
              width: '60%'
            }}>
              <Text
                style={{
                  fontSize: BasicStyles.standardFontSize,
                  fontStyle: 'italic',
                  textAlign: 'justify',
                  color: Color.white,
                  fontSize: BasicStyles.titleText.fontSize,
                  color: Color.white
                }}>
                {this.props.message}
              </Text>
              <TouchableOpacity
                onPress={() => {(Helper.checkStatus(user) < Helper.accountVerified) ?  this.validate() : this.redirect('createRequestStack')}}
                style={{
                  top: '5%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  borderRadius: 20,
                  color: Color.primary,
                  backgroundColor: Color.white,
                  borderColor: theme ? theme.primary : Color.primary,
                  borderWidth: 1,
                  width: '60%'
                }}
                >
                <Text style={{
                  color:theme ? theme.primary : Color.primary,
                  fontSize: 11,
                  textAlign: 'center'
                }}>Create Request</Text>
              </TouchableOpacity>
            </View>
            
            <View style={{
              width: '40%'
            }}>
              <Image source={require('assets/Partners.png')} style={{
                height: 150,
                width: 150
              }}/>
            </View>
              
        </View>
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
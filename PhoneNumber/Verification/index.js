import React, { Component, createRef } from 'react';
import { View, Dimensions, ScrollView, Text, Alert, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Routes, BasicStyles, Color } from 'common';
import PhoneInput from "react-native-phone-number-input";
import {NavigationActions, StackActions} from 'react-navigation';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
import Button from 'components/Form/Button';
import { TouchableHighlight } from 'react-native-gesture-handler';
import RNLocalize from "react-native-localize";

class Stack extends Component {

  constructor(props) {
    super(props);
    this.phoneInput = new createRef();
    this.state = {
      isLoading: false,
      // phoneNumber: '+639052108258',
      phoneNumber: null,
      step: 0,
      code: null,
      value: '',
      formattedValue: '',
      country: ['PH', 'US']
    }
  }

  navigate = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
            NavigationActions.navigate({routeName: 'Dashboard', params: {
              initialRouteName: 'Dashboard',
              index: 0
            }}),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  logout = () => {
    this.props.logout()
    setTimeout(() => {
      this.props.navigation.navigate('loginStack')
    }, 100)
  }

  getPhoneCode(){
    const { phoneNumber } = this.state;
    const checkValid = this.phoneInput.current?.isValidNumber(phoneNumber);
    if(checkValid === false){
      Alert.alert(
        "Error",
        "Invalid phone number. Please try again.",
        [
          {
            text: "Ok", onPress: () => {
              console.log('[log]')
            }
          }
        ]
      );
      return false
    }
    let parameter = {
      account_id: this.props.state.id,
      cellular_phone: phoneNumber
    }
    Api.request(Routes.preVerifyNum, parameter, response => {
      if(response.data == null && response.error  != null){
        Alert.alert(
          "Error",
          response.error,
          [
            {
              text: "Ok", onPress: () => {
                console.log('[error]')
              }
            }
          ]
        );
      }else{
        Alert.alert(
          "Phone Code Notification",
          "We sent a code to your phone number specified.",
          [
            {
              text: "Ok", onPress: () => {
                this.props.navigation.navigate('otpStack', {
                  data: {
                    payload: 'phone',
                    data: phoneNumber
                  }
                });
              }
            }
          ]
        );
      }
      this.setState({
        isLoading: false
      })
    }, error => {
      this.setState({
        isLoading: false
      })
    })
  }


  label(title, description){
    const { theme } = this.props.state;
    return(
      <View style={{
        justifyContent: 'center',
        width: '60%',
        marginLeft: '20%',
        marginRight: '20%'
      }}>
        <Text style={{
          fontSize: BasicStyles.standardTitleFontSize,
          color: theme ? theme.secondary : Color.secondary,
          textAlign: 'center',
          fontWeight: 'bold',
          paddingTop: 20,
          paddingBottom: 20
        }}>
          {title}
        </Text>

        <Text style={{
          textAlign: 'center'
        }}>
          {
            description
          }
        </Text>
      </View>
    )
  }

  image(image){
    return(
      <View style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
      }}>
        <Image
          source={image}
          style={{
            width: 200,
            height: 200
          }}
        />
      </View>
    )
  }
  input(){
    return(
      <View style={{
        width: '100%',
        marginTop: 25
      }}>

        <PhoneInput
            ref={this.phoneInput}
            defaultValue={this.state.phoneNumber}
            defaultCode={RNLocalize.getCountry()}
            layout="first"
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
            onChangeFormattedText={(text) => {
              this.setState({
                formattedValue: text
              })
            }}
            // withDarkTheme
            withShadow
            autoFocus
            containerStyle={{width: '100%', borderRadius: 25, backgroundColor: '#d4d9d9', borderColor: 'gray' }}
            textContainerStyle={{borderTopRightRadius: 25, borderBottomRightRadius: 25, borderColor: '#d4d9d9'}}
          />
      </View>
    );
  }

  code(){
    return(
      <View style={{
        width: '100%',
        marginTop: 25
      }}>
        <TextInput
            style={{
              ...BasicStyles.standardFormControl,
              marginBottom: 20,
              borderRadius: 25,
              textAlign: 'center'
            }}
            onChangeText={(code) => this.setState({code})}
            value={this.state.code}
            placeholder={'123456'}
          />
      </View>
    );
  }

  footer(){
    const { theme } = this.props.state;
    const { cancel } = this.props.navigation.state.params;
      return(
        <View style={{
            width: '90%',
            bottom: 50,
            left: 0,
            position: "absolute",
            alignItems: 'center',
            marginLeft: '5%',
            marginRight: '5%'
          }}>
            <Button
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                width: '100%',
                bottom: 10
              }}
              title={'Get Code'}
              onClick={() => this.getPhoneCode()}
            />

            <TouchableHighlight style={{
              width: '100%',
              justifyContent: 'center'
            }}
            onPress={() => cancel ? this.props.navigation.pop() : this.logout()}>
              <Text style={{
                fontWeight: 'bold',
                color: Color.danger
              }}>
                {cancel ? 'Cancel' : 'Logout'}
              </Text>
            </TouchableHighlight>
        </View>
      )
  }

  footerStep2(){
    const { theme } = this.props.state;
      return(
        <View style={{
            width: '90%',
            bottom: 50,
            left: 0,
            position: "absolute",
            alignItems: 'center',
            marginLeft: '5%',
            marginRight: '5%'
          }}>
            <Button
              style={{
                backgroundColor: theme ? theme.secondary : Color.secondary,
                width: '100%',
                bottom: 10
              }}
              title={'Verify'}
              onClick={() => {
              }} />

            <TouchableHighlight style={{
              width: '100%',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: theme ? theme.secondary : Color.secondary
              }}>
                Resend Code
              </Text>
            </TouchableHighlight>
        </View>
      )
  }

  render() {
    const { isLoading, step } = this.state;
    return (
      <KeyboardAvoidingView style={{
        minHeight: height * 1.5
      }}>
        {
          step == 0 && (
            <View style={{
              minHeight: height * 1.5
              }}>
              <ScrollView style={{
                padding: 20,
                width: '100%'
              }}>
      
                {
                  this.image(require('assets/verify_number.png'))
                }
                {
                  this.label('Verify Your Phone Number', 'Please select your country and type your phone number.')
                }
                {
                  this.input()
                }
              </ScrollView>
            {
              this.footer()
            }
            </View>
          )
        }

        {
          step == 1 && (
            <View style={{
              minHeight: height * 1.5
              }}>
              <ScrollView style={{
                padding: 20,
                width: '100%'
              }}>
                {
                  this.image(require('assets/verify_number.png'))
                }
                {
                  this.label('Verification Code', 'Please enter the code sent to ' + this.state.phoneNumber)
                }
                {
                  this.code()
                }
              </ScrollView>
            {
              this.footerStep2()
            }
            </View>
          )
        }
       
      </KeyboardAvoidingView>
    )
  }
}

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
)(Stack)

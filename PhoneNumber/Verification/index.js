import React, { Component } from 'react';
import { View, Dimensions, ScrollView, Text, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import { Spinner } from 'components';
import {NavigationActions, StackActions} from 'react-navigation';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
import Button from 'components/Form/Button';
import { TouchableHighlight } from 'react-native-gesture-handler';

class Stack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      phoneNumber: '+639052108258',
      step: 0,
      code: null
    }
  }

  createPaymentIntent(){
    const {params} = this.props.navigation.state;
    const { user } = this.props.state;
    if(params && params.data == null) return null
    if(user == null) return null
    this.setState({
      isLoading: true
    })
    Api.request(Routes.createPaymentIntent, {
      account_id: user.id,
      amount: params.data.amount,
      currency: params.data.currency,
      charge: params.data.charge,
      total: params.data.total,
      email: user.email
    }, response => {
      this.setState({
        isLoading: false
      })
      this.setState({
        paymentIntent: response.data
      })
    }, error => {
      this.setState({
        isLoading: false
      })
      console.log({
        error
      })
    })
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
        <TextInput
            style={{
              ...BasicStyles.standardFormControl,
              marginBottom: 20,
              borderRadius: 25,
              textAlign: 'center'
            }}
            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
            value={this.state.phoneNumber}
            placeholder={'912345678'}
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
              onClick={() => {
                this.props.navigation.navigate('otpStack', {
                  data: {
                    payload: 'phone',
                    phoneNumber: this.state.phoneNumber
                  }
                })
              }} />

            <TouchableHighlight style={{
              width: '100%',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: theme ? theme.secondary : Color.secondary
              }}>
                Skip
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
      <View style={{
        height: '100%'
      }}>
        {
          step == 0 && (
            <View style={{
              height: '100%'
              }}>
              <ScrollView style={{
                padding: 20,
                width: '100%'
              }}>
      
                {
                  this.image(require('assets/Loading.gif'))
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
              height: '100%'
              }}>
              <ScrollView style={{
                padding: 20,
                width: '100%'
              }}>
      
                {
                  this.image(require('assets/loading_christmas.gif'))
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
       
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Stack)

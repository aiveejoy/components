import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, TextInput, Picker, Image} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
class Otp extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      otp: [{
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }],
      activeIndex: 0,
      errorMessage: null
    }
  }

  submit = () => {
    let finalOtp = '';
    this.setState({
      errorMessage: null
    })
    for (var i = 0; i < 6; i++) {
      let item = this.state.otp[i]
      if(item.code == null){
        this.setState({
          errorMessage: 'Incomplete Code'
        })
        return
      }else{
        finalOtp += item.code
      }
    }
    if(this.state.errorMessage != null){
      return
    }
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }, {
        value: finalOtp,
        column: 'code',
        clause: '='
      }]
    }
    console.log('otp', parameter)
    // Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
    // });
  }

  close = () => {
    this.props.action(false)
  }
  
  setText = (code, i) => {
    console.log('i', i)
    let otp = this.state.otp.map((item, index) => {
      if(i == index){
        item.code = code
      }
      return item
    })
    this.setState({otp: otp})
    if(i < 6){
      let newIndex = parseInt(i + 1)
      this.setState({activeIndex: newIndex})
    }else{
      // disabled here
    }
    console.log('state', this.state);
  }

  _otp = () => {
    const { userLedger, messengerGroup } = this.props.state;
    let inputs = []
    for (let i = 0; i < 6; i++) {
      inputs.push(
        <TextInput
          style={{
            borderColor: Color.gray,
            borderWidth: 1,
            width: '15%',
            marginBottom: 20,
            fontSize: 16,
            textAlign: 'center',
            borderRadius: 5,
            marginRight: 2
          }}
          onChangeText={(code) => this.setText(code, i)}
          value={this.state.otp[i].code}
          placeholder={'0'}
          keyboardType={'numeric'}
          key={i}
          autoFocus={this.state.activeIndex == i}
        />
      );
    }
    return (
      <View style={{
        paddingLeft: 10,
        paddingTop: 50
      }}>
        {
          this.state.errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.danger
              }}>Opps! {this.state.errorMessage}</Text>
            </View>
          )
        }
        <View>
          <Text>
            Please enter the OTP Code sent to your email address.
          </Text>
        </View>
        <View style={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 50,
          flexDirection: 'row'
        }}>
          {
            inputs
          }
        </View>
        <View style={{
          marginTop: 50
        }}>
          <Text>
            Didn't received an email? Click the link below.
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 50
          }}>
          <TouchableOpacity
            onPress={() => this.transfer()} 
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              borderRadius: 5,
              color: Color.primary,
              backgroundColor: Color.white,
              borderColor: Color.primary,
              borderWidth: 1,
              width: '50%'
            }}
            >
            <Text style={{
              color: Color.primary,
              textAlign: 'center'
            }}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  render(){
    const { isLoading } = this.state;
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.close()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.danger
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.content}>
                {this._otp()}
              </View>
              <View style={[styles.action, {flexDirection: 'row'}]}>
                <View style={{
                  width: '50%',
                  alignItems: 'center'
                }}>
                  <TouchableOpacity 
                    onPress={() => this.close()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.danger
                    }]}>{this.props.actionLabel.no}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  borderLeftColor: Color.gray,
                  borderLeftWidth: 1
                }}>
                  <TouchableOpacity 
                    onPress={() => this.submit()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.primary
                    }]}>{this.props.actionLabel.yes}</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>
          </View>
          {isLoading ? <Spinner mode="overlay"/> : null }
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Otp);

import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, TextInput, Image} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
class Pin extends Component {
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
      errorMessage: null,
      successMessage: null,
      successFlag: false,
      otpTextInput: [],
      blockedFlag: false
    }
    this.otpTextInput = []
  }

  submit = () => {
    let finalOtp = '';
    this.setState({
      errorMessage: null
    })
    for (var i = 0; i < 6; i++) {
      let item = this.state.otp[i]
      if(item.code == null || item.code == ''){
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
    console.log('paramter', parameter)
    this.setState({isLoading: true})
    Api.request(Routes.notificationSettingsRetrieve, parameter, response => {
      this.setState({isLoading: false})
      if(response.data.length > 0){
        this.setState({errorMessage: null, successFlag: true})
        this.setState({successMessage: 'Sucessfully Verified'});
      }else{
        // blocked account
        const { setPinFlag } = this.props;
        setPinFlag(true);
        this.setState({successMessage: null, successFlag: false, errorMessage: null})
      }
    });
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
    if(i < 5 && (otp[i].code != null && otp[i].code != '')){
      let newIndex = parseInt(i + 1)
      this.otpTextInput[i + 1].focus();
      this.setState({activeIndex: newIndex})
    }else{
      // disabled here
    }
    console.log('state', this.state);
  }

  _success = () => {
    const { successMessage } = this.state;
    return (
      <View style={[styles.content, {
        justifyContent: 'center' 
      }]}>
        <Text style={{
          color: Color.primary,
          textAlign: 'center'
        }}>
        {successMessage}
        </Text>
      </View>
    );
  }

  _blocked = () => {
    return (
      <View style={[styles.content, {
        justifyContent: 'center' 
      }]}>
        <Text style={{
          color: Color.danger,
          textAlign: 'center'
        }}>
        {this.props.error}
        </Text>
      </View>
    );
  }

  _otp = () => {
    const { userLedger, messengerGroup } = this.props.state;
    const { pinFlag } = this.props.state;
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
            marginRight: 2,
            height: 50
          }}
          onChangeText={(code) => this.setText(code, i)}
          value={this.state.otp[i].code}
          maxLength={1}
          placeholder={'0'}
          keyboardType={'numeric'}
          key={i}
          autoFocus={this.state.activeIndex == i}
          ref={ref => this.otpTextInput[i] = ref}
        />
      );
    }
    return (
      <View style={{
        paddingLeft: 10,
        paddingTop: 50,
        paddingRight: 10
      }}>
        {
          this.state.errorMessage != null && pinFlag == false && (
            <View style={{
              alignItems: 'center',
              paddingBottom: 20
            }}>
              <Text style={{
                color: Color.danger,
                textAlign: 'center'
              }}>Opps! {this.state.errorMessage}</Text>
            </View>
          )
        }
        {
          pinFlag == true && (
            <View style={{
              alignItems: 'center',
              paddingBottom: 20
            }}>
              <Text style={{
                color: Color.danger,
                textAlign: 'center'
              }}>Opps! Sorry, you are not authorize to proceed the transaction. You need logout/login and do the transaction again.</Text>
            </View>
          )
        }
        {
          pinFlag == false && (
            <View>
              <Text style={{
                textAlign: 'center' 
              }}>
                Please enter your PIN sent to your email address.
              </Text>
            </View>
          )
        }
        <View style={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 50,
          flexDirection: 'row'
        }}>
          {pinFlag == false && (
              inputs
            )
          }
        </View>
      </View>
    );
  }

  footerActions = () => {
    const { successFlag } = this.state;
    return (
      <View style={[styles.action, {flexDirection: 'row'}]}>
        <View style={{
          width: '50%',
          alignItems: 'center'
        }}>
          <TouchableOpacity 
            onPress={() => this.props.onCancel()}
            underlayColor={Color.gray}
            >
            <Text style={[styles.text, {
              color: Color.danger
            }]}>{this.props.actionLabel.no}</Text>
          </TouchableOpacity>
        </View>

        {
          successFlag == false && (
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
          )
        }

        {
          successFlag == true && (
            <View style={{
              width: '50%',
              alignItems: 'center',
              borderLeftColor: Color.gray,
              borderLeftWidth: 1
            }}>
              <TouchableOpacity 
                onPress={() => this.props.onSuccess()}
                underlayColor={Color.gray}
                >
                <Text style={[styles.text, {
                  color: Color.primary
                }]}>Continue</Text>
              </TouchableOpacity>
            </View>
          )
        }
        
      </View>

    );
  }
  render(){
    const { isLoading, successFlag, successMessage } = this.state;
    const { pinFlag } = this.props.state;
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
                  <TouchableOpacity onPress={() => this.props.onCancel()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.danger
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.content}>
                {this.props.blockedFlag == false && successFlag == false && successMessage == null && (this._otp())}
                {this.props.blockedFlag == true && (this._blocked())}
                {successFlag == true && successMessage != null && (this._success())}
              </View>
              {
                this.props.blockedFlag == false && pinFlag == false && (
                  this.footerActions()
                )
              }
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
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger)),
    setPinFlag: (pinFlag) => dispatch(actions.setPinFlag(pinFlag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pin);

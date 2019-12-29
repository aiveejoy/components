import React, {Component} from 'react';
import styles from './Style';
import {Text, View, TouchableOpacity, TextInput, Picker} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
class CustomModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      currency: 'PHP',
      charge: 0,
      errorMessage: null,
      isLoading: false
    }
  }

  continue = () => {
    const { errorMessage, charge, currency } = this.state;
    const { user } = this.props.state;
    const { data } = this.props;
    if(errorMessage == null && data != null){
      // continue
      let parameter = {
        charge: charge,
        account_id: user.id,
        request_id: data.id,
        currency: currency,
        status: 'requesting',
        to: data.account_id
      }
      this.setState({
        isLoading: true
      })
      Api.request(Routes.requestPeerCreate, parameter, response => {
        this.setState({
          isLoading: false
        })
        if(response.data > 0){
          this.props.action(true)
        }else{
          this.props.action(false)
        }
      });
    }
  }

  close = () => {
    this.setState({
      currency: 'PHP',
      charge: 0,
      errorMessage: null,
      isLoading: false
    })
    this.props.action(false)
  }

  validate = () => {
    const { data } = this.props;
    const { userLedger } = this.props.state;
    const { currency, charge} = this.state;
    if(data != null && data.type < 101){
      if(data.type == 3){
        if(data.amount > userLedger.amount){
          this.setState({
            errorMessage: 'Insufficient balance!'
          })
        }else{
          this.setState({
            errorMessage: null
          })
        }
      }
    }else{
      this.setState({
        errorMessage: 'Empty request! No request was selected.'
      })
    }
    this.continue()
  }

  _charges = () => {
    const { data } = this.props;
    const { userLedger } = this.props.state;
    const { errorMessage } = this.state;
    return (
      <View>
        {
          errorMessage != null && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.danger
              }}>Opps! {errorMessage}</Text>
            </View>
          )
        }
        {
          userLedger != null && data != null && data.type == 3 && (
            <View style={{
              alignItems: 'center',
              paddingTop: 20
            }}>
              <Text style={{
                color: Color.primary,
                fontWeight: 'bold'
              }}>Your current balance</Text>
              <Text style={{
                  color: Color.primary,
                  fontSize: 30,
                  fontWeight: 'bold'
              }}>{Currency.display(userLedger.amount, userLedger.currency)}</Text>
            </View>
          )
        }
        <View style={{
          marginTop: 20
        }}>
          <Text style={{
            paddingLeft: '5%'
          }}>Select Currency</Text>
          <Picker selectedValue={this.state.currency}
          onValueChange={(currency) => this.setState({currency})}
          style={BasicStyles.pickerStyle}
          >
            {
              Helper.currency.map((item, index) => {
                return (
                  <Picker.Item
                  label={item.title} 
                  value={item.value}/>
                );
              })
            }
          </Picker>
        </View>
        <View>
          <Text style={{
            paddingLeft: '5%',
            paddingTop: 10
          }}>Charge</Text>
          <TextInput
            style={BasicStyles.formControlModal}
            onChangeText={(charge) => this.setState({charge})}
            value={this.state.charge}
            placeholder={'0'}
            keyboardType={'numeric'}
            maxLength={4}
          />
        </View>
        <View style={{
          alignItems: 'center',
          paddingTop: 20
        }}>
          <Text style={{
            color: Color.secondary,
            fontWeight: 'bold'
          }}>Your Income ({(1 - Helper.payhiramCharges.percentage) * 100}%)</Text>
          <Text style={{
              color: Color.secondary,
              fontSize: 30,
              fontWeight: 'bold'
          }}>{Currency.display(this.state.charge * (1 - Helper.payhiramCharges.percentage), this.state.currency)}</Text>
        </View>
        <View style={{
          alignItems: 'center',
          paddingTop: 20
        }}>
          <Text style={{
            color: Color.primary,
            fontWeight: 'bold'
          }}>{Helper.APP_NAME_BASIC}'s Income ({Helper.payhiramCharges.percentage * 100}%)</Text>
          <Text style={{
              color: Color.primary,
              fontSize: 30,
              fontWeight: 'bold'
          }}>{Currency.display(this.state.charge * Helper.payhiramCharges.percentage, this.state.currency)}</Text>
        </View>
      </View>
    );
  }


  render(){
    const { payload } = this.props;
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
                { payload == 'charges' && (this._charges())}
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
                    onPress={() => this.validate()}
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
)(CustomModal);

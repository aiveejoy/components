import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  SafeAreaView
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserShield, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Helper } from 'common';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import SelectWithArrow from 'components/InputField/SelectWithArrow'
const height = Math.round(Dimensions.get('window').height);
import AmountInput from 'modules/generic/AmountInput'
// import PaymentCard from 'components/Payments/Cards'
import Button from 'components/Form/Button';

class Stack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      amount: null,
      currency: 'PHP',
      selected: [],
      charge: null,
      total: null
    };
  }

  componentDidMount = () => {
    this.setState({currency: this.props.state.ledger?.currency || 'PHP'})
  }

  managePayment = (item) => {
    let temp = [];
    temp.push(item);
    this.setState({selected: temp})
    this.manageCharges(item)
  }

  manageCharges(item){
    let fee = item.feeConfiguration
    const { amount } = this.state;
    let charge = 0
    let total = 0
    if(fee.type == 'percentage'){
      charge = (amount * (fee.amount / 100)).toFixed(2)
      total = (amount - charge).toFixed(2)
      this.setState({
        charge,
        total
      })
    }else{
      charge = (amount - fee.amount).toFixed(2)
      total = (amount - charge).toFixed(2)
      this.setState({
        charge,
        total
      })
    }
  }

  navigate(route, data){
    this.props.navigation.navigate(route, {
      data: {
        data
      }
    })
  }


  manageRedirect(){
    const { selected, currency, amount } = this.state;
    let cur = this.props.state.ledger?.currency || currency
    if(amount > 0) {
    } else {
      Alert.alert('Cannot proceed', 'Input your desired amount to contiue.')
      return
    }
    if(selected.length > 0){
      switch(selected[0].code){
        case 'PAYPAL': 
          this.props.navigation.navigate('paypalStack', {
            data: {
              amount: this.state.amount,
              currency: cur,
              charge: this.state.charge,
              total: this.state.total
            }
          })
          break
        case 'VISA': 
          this.props.navigation.navigate('visaStack', {
            data: {
              amount: this.state.amount,
              currency: cur,
              charge: this.state.charge,
              total: this.state.total
            }
          })
          break
        case 'UNIONBANK':
          this.props.navigation.navigate('unioBankStack', {
            data: {
              amount: this.state.amount,
              currency: cur,
              charge: this.state.charge,
              total: this.state.total
            }
          })
          break
        case 'PAYMAYA':
          this.props.navigation.navigate('payMayaStack', {
            data: {
              amount: this.state.amount,
              currency: cur,
              charge: this.state.charge,
              total: this.state.total
            }
          })
        case 'STRIPE':
            this.props.navigation.navigate('stripeStack', {
              data: {
                amount: this.state.amount,
                currency: cur,
                charge: this.state.charge,
                total: this.state.total
              }
            })
      }
    }
  }

  renderFees = (fee) => {
    const { amount, currency, charge, total } = this.state;
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <Text>Proessing Fee</Text>
          <Text style={{
            fontWeight: 'bold'
          }}>{currency + ' ' + charge}</Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20
        }}>
          <Text style={{
            fontWeight: 'bold'
          }}>You will receive</Text>
          <Text style={{
            fontWeight: 'bold'
          }}>{currency + ' ' + total}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { isLoading, selected, currency } = this.state
    const { theme } = this.props.state;
    const { ledger, user } = this.props.state;
    let cur = ledger ? ledger?.currency : currency;
    let cards = Helper.cashInMethods;
    cards = cards.filter((item) => {
      return item.currency == cur
    })
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          {isLoading ? <Spinner mode="overlay" /> : null}
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: this.props.paddingTop ? this.props.paddingTop : 0,
            width: '100%',
            minHeight: height * 1.5
          }}>
            <AmountInput
              onChange={(amount, currency) => this.setState({
                amount: amount,
                currency: currency
              })
              }
              maximum={(user && Helper.checkStatus(user) >= Helper.accountVerified) ? Helper.MAX_VERIFIED : Helper.MAX_NOT_VERIFIED}
              type={{
                type: 'Cash In'
              }}
              disableRedirect={false}
              navigation={this.props.navigation}
            />
            {selected.length > 0 && (
              <View style={{
                padding: 20,
                backgroundColor: '#00B89F',
                height: 160,
                borderRadius: 10,
                marginBottom: 20
              }}>
                <Text style={{
                  color: Color.white,
                  fontWeight: 'bold'
                }}>
                  {selected[0].title}
                </Text>
                <Text style={{
                  color: Color.white,
                  fontWeight: 'bold'
                }}>
                  ************
                </Text>
                <Text style={{
                  fontWeight: 'bold',
                  position: 'absolute',
                  bottom: 20,
                  left: 20
                }}>
                  {selected[0].fees}
                </Text>
                <Image style={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  height: 50,
                  width: '50%',
                  resizeMode: 'contain'
                }}
                source={selected[0].logo}/>
              </View>
            )}
            <SelectWithArrow
              value={selected.length > 0 ? selected[0].title: 'Select available method'}
              onPress={() => {
                this.props.navigation.navigate('paymentCardsStack', {data: cards, setPaymentMethod: this.managePayment})
              }}
              />

              {/* <PaymentCard data={selected} press={false}/> */}
            
            {
              (selected.length > 0) && this.renderFees(selected[0].feeConfiguration)
            }
          </View>
        </ScrollView>

        {
          selected.length > 0 && (
            <View style={{
              width: '100%',
              padding: 20,
              alignItems: 'center'
            }}>
              <Button 
                style={{
                  backgroundColor: theme ? theme.secondary : Color.secondary,
                  position: 'absolute',
                  width: '100%',
                  bottom: 10
                }}
                title={'Continue'}
                onClick={() => {
                  this.manageRedirect()
                }}/>
            </View>
          ) 
        }
        

        {/*<RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          closeOnPressMask={false}
          height={height * 0.75}
          onClose={() => {
            if (this.props.onClose) {
              this.props.onClose()
            }
          }}
        >
                <PaymentCard
                  data={cards}
                  onSelect={(item) => {
                    let newSelected = []
                    newSelected.push(item)
                    this.setState({
                      selected: newSelected
                    })
                    this.RBSheet.close()
                    this.manageCharges(item)
                  }}
                  press={true}
                />
        </RBSheet>*/}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stack);

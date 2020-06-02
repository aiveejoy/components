import React, { Component } from 'react';
import Style from './Style.js';
import { View, Text, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import {NavigationActions} from 'react-navigation';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import { Empty } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
import ImageViewer from './ImageViewer.js';
import Billing from './Billing.js';
import PaymentMethod from './PaymentMethod.js';
import { WebView } from 'react-native-webview';
import Currency from 'services/Currency.js';

const height = Math.round(Dimensions.get('window').height);
class Checkout extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      toggle: false,
      total: 0,
      price: 25000,
      shippingFee: 150,
      currency: 'PHP'
    }
  }

  componentDidMount(){
    this.setState({
      total: this.state.price + this.state.shippingFee
    })
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };


  navigate = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  _floatButton = () => {
    const { product } = this.props.state;
    return(
      <View style={{
        position: 'absolute',
        left: 0,
        width: '100%',
        bottom: 10,
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <TouchableHighlight style={{
            height: 60,
            width: '100%',
            borderRadius: 10,
            backgroundColor: Color.primary,
            alignItems: 'center'
          }}
          onPress={() => {this.setState({
            toggle: true
          })}}
          underlayColor={Color.gray}
            >
            <View style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: Color.white
              }}>
              {
                Currency.display(this.state.total, this.state.currency)
              }
              </Text>
              <Text style={{
                color: Color.white,
                fontSize: 10
              }}>
               PLACE ORDER
              </Text>
            </View>
        </TouchableHighlight>
      </View>

    );
  }

  _summary = () => {
    return (
      <View style={{
        borderTopWidth: 1,
        borderTopColor: Color.gray,
        marginTop: 10
      }}>
        <View style={{
          height: 30,
          flex: 1,
          justifyContent: 'center'
        }}>
          <Text>SUMMARY</Text>
        </View>
        <View style={{
          paddingLeft: 20,
          paddingRight: 20
        }}>

          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
              fontWeight: 'bold',
              width: '50%'
            }}>
              Subtotal
            </Text>

            <Text style={{
              width: '50%',
              textAlign: 'right'
            }}>
              {
                Currency.display(this.state.price, this.state.currency)
              }
            </Text>
          </View>

          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
              fontWeight: 'bold',
              width: '50%'
            }}>
              Shipping Fee
            </Text>

            <Text style={{
              width: '50%',
              textAlign: 'right'
            }}>
              {
                Currency.display(this.state.shippingFee, this.state.currency)
              }
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { selected, isLoading, toggle } = this.state;
    const { product } = this.props.state;
    return (
      <View style={Style.MainContainer}>
        <ScrollView
          style={Style.ScrollView}
          onScroll={(event) => {
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.isLoading == false){
              }
            }
          }}
          >
          {product == null && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
          {isLoading ? <Spinner mode="overlay"/> : null }
          <View style={[Style.MainContainer, {
            minHeight: height,
            position: 'relative'
          }]}>
            {
              product && (
                <View style={{
                  paddingLeft: 10,
                  paddingRight: 10
                }}>

                  <View style={{
                    flexDirection: 'row',
                    marginBottom: 10
                  }}>
                    <View style={{
                      width: '30%',
                      height: 100
                    }}>
                      <ImageViewer image={product.featured[0]}/>
                    </View>
                    <View style={{
                      width: '70%'
                    }}>
                      <Text style={{
                        fontWeight: 'bold',
                        paddingTop: 10,
                        paddingBottom: 10
                      }}
                      numberOfLines={1}
                      >{product.title}</Text>
                      <Text>
                        {
                          Currency.display(this.state.price, this.state.currency)
                        }
                      </Text>
                    </View>
                  </View>

                  <Billing onEdit={(route) => this.navigate(route)}/>

                  <PaymentMethod />

                  {
                    this._summary()
                  }
                </View>
              )
            }
          </View>
        </ScrollView>
        {
          product && (
            this._floatButton()
          )
        }
      </View>
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
)(Checkout);
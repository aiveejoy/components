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
import ProductImages from './ProductImages.js';
import { WebView } from 'react-native-webview';
import Currency from 'services/Currency.js';
import Installment from './Installment.js';
const height = Math.round(Dimensions.get('window').height);
class Product extends Component{
  constructor(props){
    super(props);
    this.state = {
      selected: null,
      isLoading: false,
      toggle: false
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={BasicStyles.Separator}/>
    );
  };

  setAction = (index, item) => {
    this.setState({
      toggle: false
    })
    const navigateAction = NavigationActions.navigate({
      routeName: item.route
    });
    this.props.navigation.dispatch(navigateAction);
    // switch(index){
    //   case 0: // post to request
    //   break;
    //   case 1: // proceed with installments
    //   break;
    //   case 2: // direct checkout
    //   break;
    // }
  }

  _installmentRequiremens = (installment) => {
    let array = installment.requirements.split(',')
    let requirements = []
    array.map((item, index) => {
      Helper.requirementsOptions.map((itemI, indexI) => {
        if(item == itemI.payload){
          requirements.push(
            <Text>{itemI.title}</Text>
          ) 
        }
      })
      
    })
    return (
      <View>
        <Text style={{
          fontWeight: 'bold'
        }}>Installment requirements</Text>
        {
          requirements
        }
      </View>
    );
  }

  _menu = () => {
    const { options } = this.state;
    return(
      <View style={{
        position: 'absolute',
        left: 0,
        width: '100%',
        bottom: 10,
        paddingLeft: 10,
        paddingRight: 10
      }}>

        <View style={{
          width: '100%',
          borderRadius: 10,
          marginBottom: 20
        }}>
        {
          Helper.checkoutOptions.map((item, index) => {
            return (
              <TouchableHighlight style={{
                height: 60,
                width: '100%',
                backgroundColor: Color.primary,
                alignItems: 'center',
                borderBottomLeftRadius: index == 2 ? 10 : 0,
                borderBottomRightRadius: index == 2 ? 10 : 0,
                borderTopLeftRadius: index == 0 ? 10 : 0,
                borderTopRightRadius: index == 0 ? 10 : 0,
                borderBottomWidth: index < 2 ? 2 : 0,
                borderBottomColor: Color.white
              }}
                onPress={() => {this.setAction(index, item)}}
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
                    {item.title}
                    </Text>

                    <Text style={{
                      color: Color.white,
                      fontSize: 10
                    }}>
                    {item.description}
                    </Text>
                  </View>
              </TouchableHighlight>
            )
          })
        }
        </View>


        <TouchableHighlight style={{
            height: 60,
            width: '100%',
            borderRadius: 10,
            backgroundColor: Color.gray,
            alignItems: 'center'
          }}
          onPress={() => {this.setState({
            toggle: false
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
              Cancel
              </Text>
            </View>
        </TouchableHighlight>
      </View>
    );
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
                product.price.length === 1 ? Currency.display(product.price[0].price, product.price[0].currency) :
                product.price[0].currency + ' ' + product.price[product.price.length - 1].price + '-' + product.price[0].price
              }
              </Text>
              {
                product.installment != null && (
                  <Installment data={product} color={Color.white}/>
                )
              }
            </View>
        </TouchableHighlight>
      </View>

    );
  }

  render() {
    const { selected, isLoading, toggle } = this.state;
    const { product } = this.props.state;
    return (
      <View style={Style.MainContainer}>
        {isLoading ? <Spinner mode="overlay"/> : null }
        <ScrollView
          style={Style.ScrollView}
          onScroll={(event) => {
            if(event.nativeEvent.contentOffset.y <= 0) {
              if(this.state.isLoading == false){
              }
            }
          }}
          >
          {(product == null && isLoading == false) && (<Empty refresh={true} onRefresh={() => this.retrieve()}/>)}
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
                  <View>
                    <ProductImages item={product} key={product.id}/>
                  </View>

                  <View>
                    <Text style={{
                      fontWeight: 'bold',
                      paddingTop: 10,
                      paddingBottom: 10
                    }}
                    >{product.title}</Text>

                    <WebView
                      style={{
                        width: '100%'
                      }}
                      source={{html: product.description}}
                      />
                  </View>
                  {
                    product.installment != null && (
                      this._installmentRequiremens(product.installment)
                    )
                  }
                </View>
              )
            }
          </View>
        </ScrollView>
        {
          (product && toggle == false) && (
            this._floatButton()
          )
        }
        {
          (product && toggle == true) && (
            this._menu()
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
)(Product);
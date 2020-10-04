import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, TouchableHighlight, ToastAndroid, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import { Routes, Color,BasicStyles } from 'common';
import  { ModalMenu } from 'components'; 
import SwipeableFlatList from 'react-native-swipeable-list';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import Currency from 'services/Currency.js';
const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
const leftAction = () => {
  <View>
    <Text>Test</Text>
  </View>
}

const extractItemKey = item => {
  return item.id.toString();
};

class ItemOptions extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const { existData, item } = this.props;
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        {
          (existData.indexOf(item.id) < 0) && (
            <TouchableHighlight style={{
              width: (width / 5),
              backgroundColor: Color.danger,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => this.props.onAdd(this.props.item)}
            underlayColor={Color.gray}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FontAwesomeIcon icon={ faPlus } style={{color: Color.white}} size={24}/>
                <Text style={{
                  color: Color.white
                }}>Add</Text>
              </View>
            </TouchableHighlight>
            )
          }

          {
          (existData.indexOf(item.id) > -1) && (
            <TouchableHighlight style={{
              width: (width / 5),
              backgroundColor: Color.danger,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => this.props.onDelete(this.props.item)}
            underlayColor={Color.gray}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FontAwesomeIcon icon={ faTrash } style={{color: Color.white}} size={24}/>
                <Text style={{
                  color: Color.white
                }}>Remove</Text>
              </View>
            </TouchableHighlight>
            )
          }
        
      </View>
    )
  }
}

class Item extends Component {
    constructor(props){
      super(props);
    }

    render(){
      const { item, existData } = this.props;
      console.log('existData', existData)
      return (
        <View style={{
          paddingTop: 5,
          width: '100%',
          backgroundColor: Color.white,
          height: 80,
          paddingLeft: 10,
          paddingRight: 10
          // marginBottom: (index == data.length - 1) ? 100 : 0
        }}> 
          <View style={{
            flexDirection: 'row'
          }}>
            {
              (existData.indexOf(item.id) > -1) && (
                <FontAwesomeIcon icon={faCheck} size={12} style={{
                  color: Color.primary,
                  marginRight: 10
                }}/>
              )
            }
            
            <Text style={[BasicStyles.normalFontSize, {
              color: Color.gray
            }]}>{item.date}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%'
          }}>
            <Text style={[BasicStyles.normalFontSize, {
              width: '50%'      
            }]}>
            {
              'Order Number: #' + item.checkout.order_number
            }
            </Text>

            <Text style={[BasicStyles.normalFontSize, {
              width: '50%',
              color: Color.primary,
              fontWeight: 'bold',
              textAlign: 'right'
            }]}>
            {
              item.checkout.shipping_fee &&
              item.checkout.currency &&
              Currency.display(item.checkout.shipping_fee, item.checkout.currency)
            }
            </Text>
          </View>
          {/*
          <View style={{
            flexDirection: 'row'
          }}>

            <View style={{
              width: '50%'
            }}>
              <View>
                <Text style={[BasicStyles.normalFontSize, {
                  color: Color.gray
                }]}>From</Text>
              </View>
              <View style={{
                flexDirection: 'row'
              }}>
                <FontAwesomeIcon icon={faMapMarker} color={Color.primary}/>
                <Text style={[BasicStyles.normalFontSize, {
                  
                }]}>{
                  item.merchant_location.route
                }</Text>
              </View>
            </View>


            <View style={{
              width: '50%'
            }}>
              <View>
                <Text style={[BasicStyles.normalFontSize, {
                  color: Color.gray
                }]}>To</Text>
              </View>
              <View style={{
                flexDirection: 'row'
              }}>
                <FontAwesomeIcon icon={faMapMarker} color={Color.primary}/>
                {
                  item.location != null && (
                    <Text style={[BasicStyles.normalFontSize, {
                    }]}>{
                      item.location.route
                    }</Text>
                  )
                }
              </View>
            </View>

          </View>
          */}

          <View style={{
            backgroundColor: item.status != 'completed' ? Color.danger : Color.gray,
            borderRadius: 5,
            width: '30%',
            marginTop: 5
          }}>
            <Text style={{
              color: Color.white,
              textAlign: 'center'
            }}>
              {
                item.status.toUpperCase()
              }
            </Text>
          </View>
        </View>
      )
    }
  }

class Basic extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{
        height: 0.5,
        width: width,
        backgroundColor: Color.gray
      }}/>
    );
  };

  render() {
    const { data, added } = this.props;
    return (
        <SwipeableFlatList
          data={data}
          renderItem={({item}) => <Item item={item} existData={added}/>}
          maxSwipeDistance={width / 5}
          renderQuickActions={({item}) =>
            <ItemOptions
            item={item}
            onAdd={(param) => this.props.onAdd(param)}
            onDelete={(param) => this.props.onDelete(param)}
            existData={added}
            />
          }
          contentContainerStyle={{
            flexGrow: 1
          }}
          shouldBounceOnMount={true}
          ItemSeparatorComponent={this.FlatListItemSeparator}
        />
    );
  }
}

const mapStateToProps = state => ({state: state})
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Basic);
import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color, BasicStyles } from 'common'
import Config from 'src/config.js'
import Style from './Style';
import {connect} from 'react-redux';

class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  redirect(){
    const { item } = this.props;
    const { setProduct } = this.props;
    if(item == null){
      return
    }
    setProduct(item)
    this.props.navigation.navigate('productDetailsStack', {
      data: item
    })
  }

  render() {
    const { item, theme } = this.props;
    console.log('item', item)
    return (
      <TouchableOpacity
        style={Style.cardContainer}
        onPress={() => this.redirect()}
        >
        <View style={{
          width: '100%'
        }}>
          {
            (theme == 'v2' && item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10
              }}>
                <View style={[Style.paddockInfo, {
                  width: '80%'
                }]}>
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize: BasicStyles.standardTitleFontSize,
                        marginBottom:3
                      }}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        color:'#C0C0C0',
                        fontSize: BasicStyles.standardFontSize
                      }}>Batch Number:</Text>
                      <Text style={{
                        marginLeft: 5,
                        color: Color.blue,
                        fontSize: BasicStyles.standardFontSize
                      }}>{item.batch_number}</Text>
                    </View>
                  </View>
                </View>

                <View style={{
                  width: '20%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <View style={[
                    Style.paddockDate,
                    {
                      justifyContent: 'center',
                      width:'100%',
                      borderColor: Color.blue,
                      borderWidth: 0.5
                    }]}>
                    <Text style={{fontSize: BasicStyles.standardTitle2FontSize}}>{item.qty !=null ? parseFloat(item.qty).toFixed(1) + "L" : "N/A"}</Text>
                  </View>
                </View>
              </View>
            )
          }

          {
            (theme == 'v1' && item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10
              }}>
                <View style={[Style.paddockInfo, {
                  width: '70%'
                }]}>
                  <View style={{
                    width: '100%'
                  }}>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesomeIcon icon={faCircle} color={item.qty > 0 ? Color.primary : Color.danger } size={10} style={{
                        marginTop: 6,
                        marginRight: 5
                      }}/>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize: BasicStyles.standardTitleFontSize,
                        marginBottom:3
                      }}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        marginLeft: 5,
                        color: Color.gray,
                        fontSize: BasicStyles.standardFontSize
                      }}>({item.volume ? item.volume : '100L'})</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <View style={[
                    Style.paddockDate,
                    {
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      backgroundColor: item.qty > 0 ? Color.blue : Color.danger
                    }]}>
                    <Text style={{
                      fontSize: BasicStyles.standardTitle2FontSize,
                      color: Color.white
                    }}>{item.qty}</Text>
                  </View>
                </View>
              </View>
            )
          }

          {
            (theme == 'v3' && item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10
              }}>
                <View style={[Style.paddockInfo, {
                  width: '70%'
                }]}>
                  <View style={{
                    width: '100%'
                  }}>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize: BasicStyles.standardTitleFontSize,
                        marginBottom:3
                      }}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        color: Color.gray,
                        fontSize: BasicStyles.standardFontSize
                      }}>
                        {
                          item.merchant ? item.merchant : ''
                        }
                      </Text>
                      <Text style={{
                        marginLeft:5,
                        color: Color.blue,
                        fontSize: BasicStyles.standardFontSize
                      }}>({item.volume ? item.volume : '100L'})</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <View style={[
                    Style.paddockDate,
                    {
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      backgroundColor: Color.blue
                    }]}>
                    <Text style={{
                      fontSize: BasicStyles.standardTitle2FontSize,
                      color: Color.white
                    }}>{item.qty}</Text>
                  </View>
                </View>
              </View>
            )
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    setProduct: (product) => dispatch(actions.setProduct(product)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductCard);

import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color, BasicStyles } from 'common'
import Config from 'src/config.js'
import Style from './Style';
import {connect} from 'react-redux';
import Conversion from 'services/Conversion';

class VariationCard extends Component {
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
    console.log(item);
    return (
      <TouchableOpacity
        style={item.batch_number && item.batch_number.length > 0 ? Style.selectedContainer : Style.cardContainer}
        onPress={() => this.redirect()}
        
        >
        <View style={{
          width: '100%',
        }}>
             {
                this.props.info === 'variation' && (
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
                            <FontAwesomeIcon icon={faCircle} color={item.product_trace_qty > 0 ? Color.primary : Color.danger} size={10} style={{
                            marginTop: 6,
                            marginRight: 5
                            }}/>
                            <Text style={{
                            fontWeight:'bold',
                            fontSize: BasicStyles.standardTitleFontSize,
                            marginBottom:3
                            }}>{item.title} ({Conversion.getConvertedUnit(item.payload, item.payload_value)})</Text>
                        </View>
                        {/* <View style={{flexDirection:'row'}}>
                            <Text style={{
                            marginLeft: 5,
                            color: Color.gray,
                            fontSize: BasicStyles.standardFontSize
                            }}>({item.paylaod_value ? item.paylaod_value : '100L'})</Text>
                        </View> */}
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
                            backgroundColor: parseFloat(item.product_trace_qty) ? Color.primary : Color.danger
                        }]}>
                        <Text style={{
                            fontSize: BasicStyles.standardTitle2FontSize,
                            color: Color.white
                        }}>{ item.product_trace_qty }</Text>
                        </View>
                    </View>
                    </View>
                )
            }
            {
                this.props.info === 'bundled' && (
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
                                <FontAwesomeIcon icon={faCircle} color={item.qty > 0 ? Color.primary : Color.danger} size={10} style={{
                                marginTop: 6,
                                marginRight: 5
                                }}/>
                                <Text style={{
                                fontWeight:'bold',
                                fontSize: BasicStyles.standardTitleFontSize,
                                marginBottom:3
                                }}>{item.product.title}</Text>
                            </View>
                            {/* <View style={{flexDirection:'row'}}>
                                <Text style={{
                                marginLeft: 5,
                                color: Color.gray,
                                fontSize: BasicStyles.standardFontSize
                                }}>({item.paylaod_value ? item.paylaod_value : '100L'})</Text>
                            </View> */}
                            </View>
                        </View>
                        <View style={{
                            width: '30%',
                            alignItems: 'flex-end',
                            justifyContent: 'center'
                        }}>
                            {/* <View style={[
                            Style.paddockDate,
                            {
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                backgroundColor: parseFloat(item.product_trace_qty) ? Color.primary : Color.danger
                            }]}>
                            <Text style={{
                                fontSize: BasicStyles.standardTitle2FontSize,
                                color: Color.white
                            }}>{ item.product_trace_qty }</Text>
                            </View> */}
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
)(VariationCard);

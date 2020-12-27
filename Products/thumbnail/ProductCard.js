import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color } from 'common'
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
    return (
      <TouchableHighlight
        style={Style.paddockContainer}
        onPress={() => this.redirect()}
        underlayColor={Color.blue}
        >
        <View style={{
          width: '100%'
        }}>
          {
            (theme == 'v2' && item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row'
              }}>
                <View style={Style.paddockInfo}>
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize:17,
                        marginBottom:3
                      }}>{item.product_title}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        color:'#C0C0C0'
                      }}>Batch Number:</Text>
                      <Text style={{marginLeft:5,color:'#5A84EE'}}>{item.batchNum}</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  Style.paddockDate,
                  {
                    justifyContent:'center',
                    width:'20%',
                    right:-30
                  }]}>
                  <Text style={{fontSize:16}}>{item.rate!=null ? parseFloat(item.rate).toFixed(1) + "L" : "N/A"}</Text>
                </View>
              </View>
            )
          }

          {
            (theme == 'v1' && item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row'
              }}>
                <View style={[Style.paddockInfo, {
                  width: '60%'
                }]}>
                  <View style={{
                    width: '100%'
                  }}>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesomeIcon icon={faCircle} color={Color.primary} size={10} style={{
                        marginTop: 6,
                        marginRight: 5
                      }}/>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize:17,
                        marginBottom:3
                      }}>{item.title}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        marginLeft:5,
                        color:Color.gray
                      }}>({item.volume ? item.volume : '100L'})</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  Style.paddockDate,
                  {
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    backgroundColor: Color.blue,
                    marginLeft: '15%'
                  }]}>
                  <Text style={{
                    fontSize: 16,
                    color: Color.white
                  }}>{item.qty}</Text>
                </View>
              </View>
            )
          }
        </View>
      </TouchableHighlight>
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

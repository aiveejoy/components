import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color } from 'common'
import Config from 'src/config.js'
import Style from './Style';
import {connect} from 'react-redux';

class ProductCardClickable extends Component {
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
      <TouchableOpacity
        style={{
          alignItems:'center',
          width:'100%',
          paddingHorizontal: 5
        }}
        onPress={() => this.redirect()}
        underlayColor={Color.white}
        >
        <View style={Style.paddockContainer}>
          <View style={Style.paddockInfo}>
            <View>
              <View style={{flexDirection:'row'}}>
                <Text style={{
                  fontWeight:'bold',
                  fontSize:17,
                  marginBottom:3
                }}>{item.spray_mix_name}</Text>
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
)(ProductCardClickable);

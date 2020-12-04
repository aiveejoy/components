import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color } from 'common'
import Config from 'src/config.js'
import Style from './Style';

class ProductCard extends Component {
  render() {
    const { details, theme } = this.props;
    return (
      <View style={{alignItems:'center',width:'100%',height:'100%'}}>
      <View style={Style.container}>
          <View style={Style.imageContainer}>
          <Image
            style={Style.image}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
            />
          </View>
          <View style={Style.textContainer}>
            <Text style={Style.text}>A selective herbicide that allows the targetting of broadleaf and certain grass weeds in pulse a sensitive pasture situations.</Text>
          </View>
      </View>
      <View style={Style.productInfoContainer}>

      <View style={Style.cardInfo}>
        <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Manufacturer</Text>
        <Text>NewGen Chem</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Type</Text>
      <Text>Herbicide</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Group</Text>
        <Text>A & C</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Active</Text>
        <Text>995g/L Bullseythion</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Volume</Text>
        <Text>110 Liters</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Formulation</Text>
        <Text>WG</Text>
      </View>
      <Divider style={{height:0.5}}/>
      <View style={Style.cardInfo}>
      <Text style={{fontWeight:'bold',color:'#969696',width:'50%'}}>Mixing Order</Text>
        <Text>Refer Label</Text>
      </View>
      

      </View>
      <View style={Style.pdfContainer}>
  
      </View>
      </View>
    );
  }
}


export default ProductCard;
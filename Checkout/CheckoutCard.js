import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Style from './checkoutCardStyle';
import {faUserCircle,faMapMarker, faUniversity,faKaaba,faPlus,faMinus} from '@fortawesome/free-solid-svg-icons';

class CheckoutCard extends Component {
  constructor(props){
    super(props);
  }

 
  render() {
    const { details } = this.props;
    return (
      <View style={Style.container}>
   
        <View style={Style.details}>
          <View style={Style.newLeft}>
          <TouchableOpacity onPress={()=>this.props.onSubtract()}><FontAwesomeIcon style={{paddingRight:10}} icon={faMinus} color={'orange'}/></TouchableOpacity>
    <Text style={{fontSize:20,marginTop:-5,marginRight:5,marginLeft:5}}>{details.quantity}</Text>
    <TouchableOpacity onPress={()=>this.props.onAdd()}><FontAwesomeIcon style={{paddingRight:10}} icon={faPlus} color={'orange'}/></TouchableOpacity>
          </View>
          <View style={Style.leftSide}>
            <Text style={Style.title}>
              { details.title }
            </Text>
            <Text style={Style.tags,{fontiSize:15}}>
             {`PHP `+(details.price*details.quantity)}
            </Text>
          </View>
          <View style={Style.rightSide}>
          <Image source={{ uri: 'https://' + details.img_url }} style={Style.image} />
          </View>
        </View>
      </View>
    );
  }
}


export default CheckoutCard;
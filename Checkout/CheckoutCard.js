import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Style from './checkoutCardStyle';
import {faUserCircle,faMapMarker, faUniversity,faKaaba,faPlus,faMinus} from '@fortawesome/free-solid-svg-icons';

class CheckoutCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      quantity:1,
    }
  }

  onPressInc=()=>
  {
    this.setState({quantity:this.state.quantity+1})
  }

  onPressDec=()=>
  {
    if(this.state.quantity>0)
    {
    this.setState({quantity:this.state.quantity-1})
    }
  }
  render() {
    const { details } = this.props;
    return (
      <View style={Style.container}>
   
        <View style={Style.details}>
          <View style={Style.newLeft}>
          <TouchableOpacity onPress={()=>this.onPressDec()}><FontAwesomeIcon style={{paddingRight:10}} icon={faMinus} color={'orange'}/></TouchableOpacity>
    <Text style={{fontSize:20,marginTop:-5,marginRight:5,marginLeft:5}}>{this.state.quantity}</Text>
    <TouchableOpacity onPress={()=>this.onPressInc()}><FontAwesomeIcon style={{paddingRight:10}} icon={faPlus} color={'orange'}/></TouchableOpacity>
          </View>
          <View style={Style.leftSide}>
            <Text style={Style.title}>
              { details.title }
            </Text>
            <Text style={Style.tags,{fontiSize:15}}>
             {`PHP `+(details.price*this.state.quantity)}
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
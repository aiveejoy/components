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
      <View style={{alignItems:'center',width:'100%'}}>
      <View style={Style.paddockContainer}>
        
          <View style={Style.paddockInfo}>
            <View style={{flexDirection:'row'}}>
            <View style={{marginTop:6,marginRight:10,width:10,height:10,borderRadius:100/2,backgroundColor:'#D3E584'}}/>
              <Text style={{fontWeight:'bold',fontSize:17}}>{details.title}</Text>
            </View>
              <Text style={{marginLeft:19,color:'#C0C0C0'}}>{details.type}</Text>
          </View>

          <View style={Style.paddockDate}>
              <Text>{details.due_date}</Text>
              <Text style={{fontWeight:'bold',color:'#5A84EE',fontSize:12}}>DUE DATE</Text>
          </View>
     
      </View>
      </View>
    );
  }
}


export default ProductCard;
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
      <View style={{alignItems:'center',width:'100%',paddingHorizontal: 5}}>
      <View style={Style.paddockContainer}>
          <View style={Style.paddockInfo}>
          {details.name !=null && (
          <React.Fragment>
          <View style={{flexDirection:'row'}}>
            <View
            style={{
              marginTop:6,
              marginRight:10,
              width:10,
              height:10,
              borderRadius:100/2,
              backgroundColor: details.qty != null && details.qty > 0 ? '#D3E584' : '#FF6262'
            }}
          />
     <Text style={{fontWeight:'bold',fontSize:17,marginBottom:3}}>{details.name}</Text>
     </View>
     {
        details.dataFrom && details.dataFrom === 'inventory' ? (
          <Text style={{marginLeft:19,color:'#C0C0C0'}}>{details.volume}</Text>
        ) : (  
          <Text style={{marginLeft:19,color:'#C0C0C0'}}>Spray Mix</Text>
        )
     }    
     </React.Fragment>
     )}
     {
       details.dataFrom=='paddockPage' && (
        <React.Fragment>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontWeight:'bold',fontSize:17,marginBottom:3}}>{details.item.spray_mix_name}</Text>
        </View>
        {
          details.status!="due" && (
            <View style={{flexDirection:'row'}}>
            <Text style={{color:'#C0C0C0'}}>Batch Number:</Text>
            <Text style={{marginLeft:5,color:'#5A84EE'}}>{details.item.batchNum}</Text>
          </View>
          )
        }
        </React.Fragment>

       )
     }
      {
        details.dataFrom !== 'inventory' && details.volume != null && (
          <React.Fragment>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontWeight:'bold',fontSize:17}}>{details.title}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'#C0C0C0'}}>Batch Number:</Text>
              <Text style={{marginLeft:5,color:'#5A84EE'}}>{details.batchNum}</Text>
            </View>
          </React.Fragment>
        )
      }
          </View>
          {
            details.due_date != null && (
              <View style={Style.paddockDate}>
                <Text>{details.due_date}</Text>
                <Text style={{fontWeight:'bold',color:'#5A84EE',fontSize:12}}>DUE DATE</Text>
              </View>
            )
          }
            {
            details.created_at != null && (
              <View style={Style.paddockDate}>
                <Text>{details.created_at.substr(0,details.created_at.indexOf(' '))}</Text>
                <Text style={{fontWeight:'bold',color:'#5A84EE',fontSize:12}}>DUE DATE</Text>
              </View>
            )
          }
           {
       details.dataFrom=='paddockPage' && (
        <View style={[Style.paddockDate,{justifyContent:'center',width:'20%',right:-30}]}>
          <Text style={{fontSize:16}}>{details.item.rate!=null ? details.item.rate+"L" : "N/A"}</Text>
        </View>
       )
     }
          {
            details.dataFrom !== 'inventory' && details.volume != null && (
              <View style={Style.batchVolume}>
                <Text>{details.weight}</Text>
              </View>
            )
          }
          {
            details.dataFrom === 'inventory' && details.qty != null && (
              <View style={Style.stocks}>
                <View style={[Style.stocksBox, { backgroundColor: details.qty > 0 ? '#5A84EE' : '#FF6262' } ]}>
                  <Text style={Style.stocksText}>
                    {details.qty}
                  </Text>
                </View>
              </View>
            )
          }
     
      </View>
      </View>
    );
  }
}


export default ProductCard;
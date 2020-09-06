import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Style from './ledgerStyle';
import {faUserCircle,faMapMarker, faUniversity,faKaaba,faFilter,faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import { Thumbnail, List, ListItem, Separator } from 'native-base';



class Ledger extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const {details}=this.props;
    return (
      <View>
      <Collapse>
      <CollapseHeader>
    
      <Separator bordered style={{height:50,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#EDEDED'}}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontWeight:'bold', width:'50%'}}>{details.created_at_human}</Text>
        {details.amount>0 ? <Text style={{color: "green", position:"absolute",left:200,top:15,width:'30%'}}>{`+ ${details.currency} ${details.amount}`}</Text> : <Text style={{color: "red", position:"absolute",left:200,top:15,width:'30%'}}>{`- ${details.currency} ${details.amount}`}</Text>}
        {/* <Text style={{color: "red", position:"absolute",left:200,top:15,width:'30%'}}>{`+ ${details.currency} ${details.amount}`}</Text> */}
        <FontAwesomeIcon style={{marginRight:20,width:'10%'}} icon={faChevronDown}/>
        </Separator>
      </CollapseHeader>
      
      <CollapseBody style={{backgroundColor:'white'}}>
      <View style={{margin:10}}>
      <Text>{details.description}</Text>
       <Text>
         <Text style={{fontWeight:'bold'}}>
        {`Mode of Payment: `}
         </Text>
         <Text>
          {details.payment_payload}
           </Text>
           </Text>
      </View>
      </CollapseBody>
    </Collapse>
      </View>
    );
  }
}


export default Ledger;
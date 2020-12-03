import React, { Component } from 'react';
import {View, Image,TouchableHighlight,Text,ScrollView,FlatList, Dimensions,TouchableOpacity,TextInput,SafeAreaView} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Thumbnail, List, ListItem, Separator } from 'native-base';
import { connect } from 'react-redux';
import {faPlus,faMinus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Style from './Style.js';


const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class TaskIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
     
    }
  componentDidMount(){
    const { user } = this.props.state;
    if (user != null) {
    }
  }
  render() {
    const bottom=this.props.bottom ? this.props.bottom : 150
    return (
       <View style={{position:'absolute',bottom:bottom,alignSelf:'flex-end'}}>
       <TouchableOpacity onPress={()=>alert('redirect')}>
          <View style={{alignItems:'center'}}>
          <Image
          style={{padding:30,height:50,width:'100%'}}
            source={require('../../assets/taskIcon.png')}
            />
          </View>
       </TouchableOpacity>
    </View>
    );
  }
}
const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskIcon);

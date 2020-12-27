import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color } from 'common'
import Config from 'src/config.js'
import Style from './Style';
import {connect} from 'react-redux';

class PaddockCard extends Component {
  constructor(props) {
    super(props);
  }

  redirect(){
    const { item } = this.props;
    const { setPaddock } = this.props;
    if(item == null){
      return
    }
    setPaddock({
      ...item,
      from: this.props.from
    })
    this.props.navigation.navigate('paddockStack', {
      data: item
    })
  }

  render() {
    const { item } = this.props;
    return (
      <TouchableHighlight
        style={Style.cardContainer}
        onPress={() => this.redirect()}
        underlayColor={Color.blue}
        >
        <View style={{
          width: '100%'
        }}>
          {
            item && (
              <View style={{
                width: '100%',
                flexDirection: 'row'
              }}>
                <View style={[Style.paddockInfo, {
                  width: '60%'
                }]}>
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesomeIcon icon={faCircle} color={Color.primary} size={10} style={{
                        marginTop: 6,
                        marginRight: 5
                      }}/>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize: 17,
                        marginBottom:3
                      }}>{item.name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        marginLeft:5,
                        color: Color.gray
                      }}>Spray Mix</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  Style.paddockDate,
                  {
                    justifyContent:'center',
                    width:'30%',
                  }]}>
                  <Text>12/09/2020</Text>
                  <Text style={{fontSize:11}}>{item.status}</Text>
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
    setPaddock: (product) => dispatch(actions.setPaddock(product)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaddockCard);

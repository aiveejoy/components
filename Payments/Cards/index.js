import React, { Component } from 'react';
import { View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
const width = Math.round(Dimensions.get('window').width);
class Stack extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    const { data } = this.props;
    return (
      <View style={{
        width: '100%',
        borderBottomColor: Color.gray,
        borderBottomWidth: 1
      }}>
        {
          data && data.map((item, index) => (
            <TouchableHighlight
              onPress={() => {
                if(this.props.press == false) return
                this.props.onSelect(item)
              }}
              style={{
                width: '100%',
                borderRadius: 15,
                marginBottom: 20,
                padding: 20
              }}
              underlayColor={Color.white}
              >
                <View>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: BasicStyles.standardTitleFontSize
                  }}>{item.title}</Text>
                  <Text style={{
                    paddingTop: 10
                  }}>{item.fees}</Text>
                
                  {/*<View style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Image 
                      source={item.logo}
                      style={{
                        height: 30,
                        width: width / 3,
                        resizeMode: 'stretch',
                      }}
                      />
                  </View>*/}
                </View>
                
            </TouchableHighlight>
          ))
        }
        
      </View>
    );
  }
}

export default Stack;
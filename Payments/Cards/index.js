import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableHighlight, Dimensions} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import { connect } from 'react-redux';
class Stack extends Component{
  
  constructor(props){
    super(props);
  }

  render () {
    const { params } = this.props.navigation;
    return (

      <View style={{
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
            <View style={{
              minHeight: height * 1.25,
              padding: 20
            }}>
              <View style={{
                width: '100%',
                borderBottomColor: Color.gray,
                borderBottomWidth: 1
              }}>
                {
                  params && params.data && params.data.map((item, index) => (
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
          </View>
          
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stack);

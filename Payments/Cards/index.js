import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
class Stack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttons: [
        {
          title: 'Banks',
          value: 'bank'
        },
        {
          title: 'E-wallets',
          value: 'ewallet'
        }
      ],
      selected: 'bank'
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    const { theme } = this.props.state;
    const { buttons, selected } = this.state;
    return (

      <View style={{
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.25
          }}>
            <View style={{
              width: '100%'
            }}>
              <View style={{
                padding: 20,
                flexDirection: 'row'
              }}>
                {buttons.map(item => (<TouchableOpacity style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: selected == item.value ? (theme ? theme.primary : Color.primary) : Color.white,
                  height: 40,
                  width: 70,
                  borderRadius: 10,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: selected == item.value ? (theme ? theme.primary : Color.primary) : Color.lightGray
                }}
                  onPress={() => {
                    this.setState({ selected: item.value });
                  }}>
                  <Text style={{
                    color: selected == item.value ? Color.white : Color.black,
                    fontWeight: 'bold'
                  }}>{item.title}</Text>
                </TouchableOpacity>))}
              </View>
              {
                params && params.data && params.data.map((item, index) => {
                  if (item.type == selected) {
                    return (
                      <TouchableHighlight
                        onPress={() => {
                          if (this.props.press == false) return
                          this.props.navigation?.state?.params?.setPaymentMethod(item);
                          this.props.navigation.navigate('directCashInStack', {paymentMethod: item});
                        }}
                        style={{
                          width: '100%',
                          borderRadius: 15,
                          marginBottom: 20,
                          borderBottomColor: Color.lightGray,
                          borderBottomWidth: 1,
                          padding: 20
                        }}
                        underlayColor={Color.white}
                      >
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <View style={{
                            borderWidth: 1,
                            borderColor: Color.lightGray,
                            borderRadius: 5,
                            height: 50,
                            width: 50,
                          }}>
                            <Image source={item.logo} style={{
                              height: '100%',
                              width: '100%',
                              resizeMode: 'contain'
                            }} />
                          </View>
                          <View style={{
                            padding: 10
                          }}>
                            <Text style={{
                              fontWeight: 'bold',
                              fontSize: BasicStyles.standardTitleFontSize
                            }}>{item.title}</Text>
                            <Text style={{
                              fontSize: 12
                            }}>{item.fees}</Text>
                          </View>
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
                    )
                  }
                })
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

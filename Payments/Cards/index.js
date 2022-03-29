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
      data: [],
      preffered: [{
        title: 'Stripe CC / DC',
        description: '0000-0000-0000-0000',
        fees: '3% Fee',
        logo: require('assets/stripe.png'),
        color: Color.primary,
        code: 'STRIPE',
        type: 'bank',
        currency: 'USD',
        feeConfiguration: {
          type: 'percentage',
          amount: 4
        }
      }, {
        title: 'VISA DIRECT',
        description: 'Accepts Credit / Debit Card',
        fees: 'Zero Fees',
        logo: require('assets/visa.png'),
        color: '#1A1F71',
        code: 'VISA',
        type: 'bank',
        currency: 'USD',
        country: 'International',
        feeConfiguration: {
          type: 'percentage',
          amount: 2
        }
      }]
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    let temp = params.data?.length > 0 && params.data.sort(function(a, b) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    this.setState({data: temp})
  }

  render() {
    const { theme } = this.props.state;
    const { buttons, selected, data, preffered } = this.state;
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
              {
                data.length > 0 && data.map((item, index) => {
                  return (
                    <TouchableHighlight
                      onPress={() => {
                        if (this.props.press == false) return
                        this.props.navigation?.state?.params?.setPaymentMethod(item);
                        this.props.navigation.navigate('directCashInStack', { paymentMethod: item });
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
                      </View>

                    </TouchableHighlight>
                  )
                })
              }
              <View style={{
                padding: 20,
                borderBottomColor: Color.lightGray,
                borderBottomWidth: 1,
              }}>
                <Text style={{
                  fontWeight: 'bold',
                  color: Color.darkGray,
                  fontStyle: 'italic'
                }}>PREFERRED METHODS </Text>
              </View>
              {
                preffered.length > 0 && preffered.map((item, index) => {
                  return (
                    <TouchableHighlight
                      onPress={() => {
                        if (this.props.press == false) return
                        this.props.navigation?.state?.params?.setPaymentMethod(item);
                        this.props.navigation.navigate('directCashInStack', { paymentMethod: item });
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
                      </View>

                    </TouchableHighlight>
                  )
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

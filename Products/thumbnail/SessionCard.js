import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common'
import Style from './Style';
import {connect} from 'react-redux';

class SessionCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity
        style={Style.cardContainer}
        onPress={() => this.props.navigation.navigate('sessionStack', {
            data: {
              ...item
            }
          })
        }   
        >
        <View style={{
          width: '100%'
        }}>
          {
            item && (
              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10
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
                      <Text
                        numberOfLines={1}
                        style={{
                        fontWeight:'bold',
                        fontSize: BasicStyles.standardTitleFontSize,
                        marginBottom: 3
                      }}>{item.session ? 'Session: ' + item.session : null}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        marginLeft: 18,
                        color: Color.gray,
                        fontSize: BasicStyles.standardFontSize
                      }}>{item.name ? item.name : null}</Text>
                    </View>
                  </View>
                </View>
                <View style={{
                  width: '40%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <View style={[
                    Style.paddockDate,
                    {
                      justifyContent:'center',
                      width:'100%'
                    }]}>
                    <Text style={{
                      fontSize: BasicStyles.standardFontSize
                    }}>{item.date_completed_formatted}</Text>
                    <Text style={{
                      fontSize: BasicStyles.standardFontSize - 1,
                      color: Color.blue,
                      fontWeight: 'bold'
                    }}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            )
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({state: state});

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux');
  return {
    // setPaddock: (product) => dispatch(actions.setPaddock(product)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionCard);

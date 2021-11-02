import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faStopwatch, faCircle, faPlay, faImage } from '@fortawesome/free-solid-svg-icons';
import { Divider } from 'react-native-elements';
import { Color, BasicStyles } from 'common'
import Config from 'src/config.js'
import Style from './Style';
import {connect} from 'react-redux';
import Conversion from 'services/Conversion';

class ProductUnallocated extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, keya } = this.props;
    return (
      <TouchableOpacity
        style={keya === null && item.batch_number && item.batch_number.length > 0 ? Style.selectedContainer : Style.cardContainer}
        onPress={() => console.log('[nothing]')}
        
        >
        <View style={{
          width: '100%',
        }}>
          {
            (item) && (
              <View style={{
                width: '100%',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
                <View style={[Style.paddockInfo, {
                  width: '70%'
                }]}>
                  <View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        fontWeight:'bold',
                        fontSize: BasicStyles.standardTitleFontSize,
                        marginBottom:3,
                        // color: 'white',
                      }}>{item.product_name}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Text style={{
                        color: '#C0C0C0',
                        fontSize: BasicStyles.standardFontSize
                      }}>Batch Number:</Text>
                      <Text
                        style={{
                        marginLeft: 5,
                        color: Color.blue,
                        fontSize: BasicStyles.standardFontSize
                      }}>{keya}</Text>
                    </View>
                  </View>
                </View>

                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <View style={[
                    Style.paddockDate,
                    {
                      justifyContent: 'center',
                      width:'100%',
                      borderColor: Color.blue,
                      borderWidth: 0.5
                    }]}>
                    {/* <Text style={{fontSize: BasicStyles.standardTitle2FontSize}}>{item.applied_rate !=null ? parseFloat(item.applied_rate).toFixed(1) : "N/A"}</Text> */}
                    <Text style={{fontSize: BasicStyles.standardTitle2FontSize}}>{item.applied_rate !=null ? parseFloat(item.applied_rate).toFixed(1) + (item.payload ? Conversion.getUnitsAbbreviation(item.payload) : null) : "N/A"}</Text>
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
    setProduct: (product) => dispatch(actions.setProduct(product)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductUnallocated);

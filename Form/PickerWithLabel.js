import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-community/picker';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class PickerWithLabel extends Component{

  constructor(props){
    super(props);
    this.state = {
      iosData: [],
      input: null
    }
  }

  componentDidMount(){
    this.dataOnIOS()
  }

  onChange(input){
    this.setState({input})
    this.props.onChange(input)
  }

  dataOnIOS(){
    const { data } = this.props;

    const iOSData = data.map((item) => {
      return {
        label: item.title,
        value: item.value
      };
    });
    this.setState({
      iosData: iOSData
    })
  }

  render () {
    const { label, data, placeholder, onError } = this.props;
    const { iosData } = this.state;
    return (
        <View style={{
          width: '100%'
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            <Text style={{
              fontSize: BasicStyles.standardFontSize,
              paddingTop: 10,
              paddingBottom: 10
            }}>
              {label}
            </Text>
            {
              this.props.required && (
                <Text style={{
                  paddingLeft: 5,
                  paddingTop: 10,
                  color: Color.danger
                }}>*</Text>
              )
            }

            {
              onError && (
                <Text style={{
                  paddingLeft: 5,
                  paddingTop: 10,
                  color: Color.danger
                }}>{onError}</Text>
              )
            }
          </View>
          <View style={{
            borderWidth: 1,
            borderColor: Color.lightGray,
            borderRadius: 5
          }}>
            {
              Platform.OS == 'android' && (
                <Picker selectedValue={this.state.input}
                  onValueChange={(input) => this.onChange(input)}
                  style={BasicStyles.pickerStyleCreate}
                  >
                    {
                      data.map((item, index) => {
                        return (
                          <Picker.Item
                          key={index}
                          label={item.title} 
                          value={item.value}/>
                        );
                      })
                    }
                  </Picker>
              )
            }
            {
              (Platform.OS == 'ios' && iosData.length > 0) && (
                <RNPickerSelect
                  onValueChange={(input) => this.onChange(input)}
                  items={iosData}
                  style={BasicStyles.pickerStyleIOSNoMargin}
                  placeholder={{
                    label: placeholder ? placeholder : 'Click to select',
                    value: null,
                    color: Color.primary
                  }}
                  />
              )
            }
          </View>
        </View>
    );
  }
}
export default PickerWithLabel;
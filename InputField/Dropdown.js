import React, { Component } from 'react';
import { View, Text} from 'react-native';
import { Color, BasicStyles } from 'common';
import { Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-community/picker';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Dropdown extends Component{

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
    const { label, data, placeholder, style } = this.props;
    const { iosData } = this.state;
    return (
        <View style={{
        }}>
          <Text style={{
            fontWeight: 'bold'
          }}>{label}</Text>
          {
            Platform.OS == 'android' && (
              <Picker selectedValue={this.state.input}
                onValueChange={(input) => this.onChange(input)}
                style={style == null ? BasicStyles.pickerStyleCreate : style}
                placeholder={placeholder ? placeholder : 'Click to select'}>
                  {
                    data.map((item, index) => {
                      return (
                        <Picker.Item
                        key={index}
                        label={item.title}
                        style={{
                          fontSize: BasicStyles.standardFontSize
                        }}
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
                style={style == null ? BasicStyles.pickerStyleIOSNoMargin : style}
                placeholder={{
                  label: placeholder ? placeholder : 'Click to select',
                  value: null,
                  color: Color.primary
                }}
                />
            )
          }
        </View>
    );
  }
}
export default Dropdown;
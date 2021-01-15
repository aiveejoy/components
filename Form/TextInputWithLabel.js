import React, {Component} from 'react';
import { Text, View, TextInput } from 'react-native';
import { BasicStyles, Color } from 'common';
class TextInputWithLabel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onError } = this.props;
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
            {this.props.label}
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
        <View style={BasicStyles.standardTextInput}>
          <TextInput
            value={this.props.variable}
            multiline={this.props.multiline}
            maxLength={this.props.maxLength}
            keyboardType={this.props.keyboardType}
            editable={this.props.editable}
            onChangeText={(input) => {
              this.props.onChange(input);
            }}
            placeholder={this.props.placeholder ? this.props.placeholder : 'Type here'}
          />
        </View>
      </View>
    );
  }
}

export default TextInputWithLabel;

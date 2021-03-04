import React, {Component} from 'react';
import { Text, View, TextInput, Platform } from 'react-native';
import { BasicStyles, Color } from 'common';
class TextInputWithoutLabel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onError } = this.props;
    return (
      <View style={{
        width: '100%',
        ...this.props.style,
        minHeight: Platform.OS == 'ios' ? 100 : 100
      }}>
        <View style={{
          ...BasicStyles.standardTextInputNotCentered,
          minHeight: Platform.OS == 'ios' ? 100 : 100
        }}>
          <TextInput
            value={this.props.variable}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            maxLength={this.props.maxLength}
            keyboardType={this.props.keyboardType}
            editable={this.props.editable}
            onChangeText={(input) => {
              this.props.onChange(input);
            }}
            placeholder={this.props.placeholder ? this.props.placeholder : 'Type here'}
            style={{
              textAlignVertical: 'top'
            }}
          />
        </View>
      </View>
    );
  }
}

export default TextInputWithoutLabel;

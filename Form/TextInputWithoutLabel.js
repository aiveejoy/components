import React, {Component} from 'react';
import { Text, View, TextInput } from 'react-native';
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
        ...this.props.style
      }}>
        <View style={{
          ...BasicStyles.standardTextInput,
          height: 'auto'
        }}>
          <TextInput
            value={this.props.variable}
            multiline={this.props.multiline}
            numberOfLines={this.props.numberOfLines}
            maxLength={this.props.maxLength}
            keyboardType={this.props.keyboardType}
            editable={this.props.editabl}
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

export default TextInputWithoutLabel;

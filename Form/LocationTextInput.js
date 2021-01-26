import React, {Component} from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { BasicStyles, Color } from 'common';
class TextInputWithLabel extends Component {
  constructor(props) {
    super(props);
  }

  redirect(route){
    this.props.navigation.navigate(route)
  }

  render() {
    const { onError } = this.props;
    return (
      <TouchableOpacity
        style={{
          width: '100%'
        }}
        onPress={() => this.redirect(this.props.route)}
        >
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


        {
          this.props.multiline && (
            <View style={BasicStyles.standardTextInputMultiline}>
              <TextInput
                value={this.props.variable}
                onFocus={() => {
                  this.redirect(this.props.route);
                }}
                placeholder={this.props.placeholder ? this.props.placeholder : 'Type here'}
                multiline={true}
                numberOfLines={this.props.numberOfLines}
              />
            </View>
          )
        }

        {
          !this.props.multiline && (
            <View style={BasicStyles.standardTextInput}>
              <TextInput
                value={this.props.variable}
                onFocus={() => {
                  this.redirect(this.props.route);
                }}
                placeholder={this.props.placeholder ? this.props.placeholder : 'Type here'}
              />
            </View>

          )
        }
        
      </TouchableOpacity>
    );
  }
}

export default TextInputWithLabel;

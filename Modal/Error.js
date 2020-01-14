import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
class ErrorModal extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={[styles.container, {
              height: '60%',
              marginTop: '20%'
            }]}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={[styles.text, {
                    color: Color.primaryDark,
                    fontWeight: 'bold' 
                  }]}>{this.props.title ? this.props.title : 'Sorry for Inconvenience!'}</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.props.onCLose()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.primaryDark,
                      fontWeight: 'bold'
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.content, {
                height: '100%',
                justifyContent: 'center'
              }]}>
                <Text style={{
                  color: Color.primaryDark,
                  textAlign: 'center'
                }}>
                {
                  this.props.message ? this.props.message : 'We are working hard to minimize this to happen again. Please refresh your page.'
                }
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default ErrorModal;

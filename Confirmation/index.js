import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
class Confirmation extends Component {
  constructor(props){
    super(props);
  }


  footerActions = () => {
    return (
      <View style={[styles.action, {flexDirection: 'row'}]}>
        <View style={{
          width: '50%',
          alignItems: 'center'
        }}>
          <TouchableOpacity 
            onPress={() => this.props.onCancel()}
            underlayColor={Color.gray}
            >
            <Text style={[styles.text, {
              color: Color.danger
            }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          width: '50%',
          alignItems: 'center',
          borderLeftColor: Color.gray,
          borderLeftWidth: 1
        }}>
          <TouchableOpacity 
            onPress={() => this.props.onContinue()}
            underlayColor={Color.gray}
            >
            <Text style={[styles.text, {
              color: Color.primary
            }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }

  render(){
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={[styles.container, {
              height: '60%',
              marginTop: '10%'
            }]}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={[styles.text, {
                    color: Color.primaryDark,
                    fontWeight: 'bold' 
                  }]}>Confirmation Needed!</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.props.onCancel()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.primaryDark,
                      fontWeight: 'bold'
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.content, {
                height: '75%',
                justifyContent: 'center'
              }]}>
                <Text style={{
                  color: Color.primaryDark,
                  textAlign: 'center'
                }}>
                Are you sure you want to continue?
                </Text>
              </View>
              {
                this.footerActions()
              }
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Confirmation;

import React, { Component } from "react";
import {Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import styles from './Style.js';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Confirm extends Component {
  constructor(props){
    super(props);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={[styles.container, {
              height: '30%',
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
                  }]}>{this.props.title}</Text>
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
                height: '50%',
                justifyContent: 'center'
              }]}>
                <Text style={{
                  color: Color.primaryDark,
                  textAlign: 'center'
                }}>
                {
                  this.props.message
                }
                </Text>
              </View>
              <View style={[styles.action, {
                flexDirection: 'row',
                height: '100%'
              }]}>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginTop: '5%',
                  height: '100%'
                }}>
                  <TouchableOpacity
                    underlayColor={Color.gray} 
                    style={[{backgroundColor: Color.danger, width: '80%', marginLeft: 5, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5,}]}
                    onPress={() => this.props.onCLose()}
                    >
                    <Text style={{ color: Color.white}}
                    >No</Text>
                  </TouchableOpacity>
                </View>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  marginTop: '5%',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <TouchableOpacity
                    underlayColor={Color.gray} 
                    style={[{backgroundColor: Color.secondary, width: '80%', marginRight: 5, alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 5,}]}
                    onPress={() => this.props.onConfirm()}
                    >
                    <Text style={{ color: Color.white}}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Confirm;
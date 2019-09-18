import React, {Component} from 'react';
import styles from './Style';
import {Text, View, TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Color } from 'common';
class ModalMenu extends Component {
  render(){
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.props.change(false)} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={styles.icon}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.content}>
                <Text>{this.props.message}</Text>
              </View>
              <View style={styles.action}>
                <View style={{
                  width: '50%'
                }}>
                  <TouchableOpacity 
                    onPress={() => this.props.action(false)}
                    underlayColor={Color.gray}
                    >
                    <Text style={styles.text}>No</Text>
                  </TouchableOpacity>
                </View>
                <View style={{
                  width: '50%'
                }}>
                  <TouchableOpacity 
                    onPress={() => this.props.action(true)}
                    underlayColor={Color.gray}
                    >
                    <Text style={styles.text}>Yes</Text>
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

export default ModalMenu;
import React, {Component} from 'react';
import styles from './Style.js';
import { View, TouchableOpacity, Image, Platform} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Color , BasicStyles} from 'common';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
import Config from 'src/config.js';
class ImageModal extends Component {
  constructor(props){
    super(props);
  }

  action = () => {
    console.log('hi')
    this.props.action()
  }

  render(){
    return (
      <View style={{
        backgroundColor: Color.secondary,

      }}>
        <Modal isVisible={this.props.visible} style={{
          padding: 0,
          margin: 0
        }}>
          <View style={styles.containerImage}>
            <View>
              <View style={{
                width: '100%',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: 50,
                marginTop: Platform == 'android' ? 0 : 20,
                marginRight: Platform == 'android' ? 0 : 20,
              }}>
                <TouchableOpacity onPress={() => this.action()} style={[styles.close, {
                }]}>
                  <FontAwesomeIcon icon={ faTimes } style={{
                    color: Color.white
                  }} size={BasicStyles.iconSize} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center'
            }}>
              <Image
                source={{uri: this.props.url}}
                style={{
                  width: '100%',
                  height: '50%',
                  resizeMode: 'center'
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default ImageModal

import React, {Component} from 'react';
import styles from './Style.js';
import {Text, View, TouchableOpacity, TextInput, Image} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
class Sketch extends Component {
  constructor(props){
    super(props);
  }

  getBase64 = () => {
    this.sketch.getBase64('png', false, true, false, false, (err, result) => {
      if(result){
        this.props.send(result)
        this.props.close()
      }
    })
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
          <View style={styles.containerSketch}>

            <View>
              <Text style={{
                color: Color.primary,
                fontWeight: 'bold',
                lineHeight: 50,
                textAlign: 'center',
                borderBottomColor: Color.lightGray,
                borderBottomWidth: 1,
              }}>Write Signature</Text>
            </View>
            <SketchCanvas
              ref={ref => this.sketch = ref}
              style={{ flex: 1 }}
              strokeColor={'black'}
              strokeWidth={5}
            />

            <View>
              <View 
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderColor: Color.lightGray,
                  borderWidth: 1,
                }}>
                <TouchableOpacity
                  onPress={() => this.props.close()} 
                  style={[styles.sketchBtn, BasicStyles.standardButton, {
                    width: '25%',
                    backgroundColor: Color.danger,
                    marginRight: 10
                  }]}
                  >
                  <Text style={{
                    color: Color.white,
                    textAlign: 'center'
                  }}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.sketch.clear()} 
                  style={[styles.sketchBtn, BasicStyles.standardButton, {
                    width: '25%',
                    backgroundColor: Color.secondary,
                    marginRight: 10
                  }]}
                  >
                  <Text style={{
                    color: Color.white,
                    textAlign: 'center'
                  }}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.getBase64()} 
                  style={[styles.sketchBtn, BasicStyles.standardButton, {
                    width: '25%',
                    backgroundColor: Color.primary
                  }]}
                  >
                  <Text style={{
                    color: Color.white,
                    textAlign: 'center'
                  }}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUserLedger: (userLedger) => dispatch(actions.setUserLedger(userLedger))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sketch);

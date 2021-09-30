import React, { Component, createRef } from 'react';
import styles from './Style.js';
import { Text, View, TouchableOpacity, TextInput, Dimensions, Clipboard, ToastAndroid } from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { Color, BasicStyles } from 'common';
import QRCode from 'react-native-qrcode-svg';
import { Tooltip } from 'react-native-elements';

const width = Math.round(Dimensions.get('window').width);
class QRCodeModal extends Component {
  constructor(props) {
    super(props);
    this.tooltipRef = createRef()
  }
  _popover = () => {
    return (
      <View style={[{
        flexDirection: 'row',
        marginTop: 10,
      }]}>

        <View style={{
          width: '70%',
          alignItems: 'center',
          padding: 5
        }}>

          <TextInput
            editable={false}
            style={[BasicStyles.formControlCreate, { borderColor: Color.black, color: Color.black }]}
            value={"sample link"}
          />
        </View>
        {/*  */}
        <View style={{
          width: '30%',
          marginRight: 10,
          alignItems: 'flex-end',
          height: '100%',
          padding: 5
        }}>
          <TouchableOpacity
            style={[BasicStyles.btn, BasicStyles.btnSecondary, { width: '100%' }]}
            onPress={() => {
              Clipboard.setString('sample link')
              ToastAndroid.showWithGravityAndOffset(
                "Copied successfully",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }}
          >
            <Text style={[{
              color: Color.white,
              textAlign: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center'
            }]}>Copy link</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render() {
    return (
      <View>
        <Modal isVisible={true}>
          <View style={styles.mainContainer}>
            <View style={[styles.container, {
              height: '60%',
            }]}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={[styles.text, {
                    color: Color.primaryDark,
                    fontWeight: 'bold'
                  }]}>{""}</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                  <TouchableOpacity onPress={() => this.props.setQRCodeModal(false)} style={styles.close}>
                    <FontAwesomeIcon icon={faTimes} style={{
                      color: Color.primaryDark,
                      fontWeight: 'bold'
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.content, {
                height: '90%',
                justifyContent: 'center',
                alignContent: 'center'
              }]}>

                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 30
                }} >
                  <QRCode
                    size={220}
                    value={this.props.user.code}
                  />
                </View>

                <View style={[styles.action, {
                  flexDirection: 'row',
                  height: '10%'
                }]}>

                  <View style={{
                    width: '70%',
                    alignItems: 'center',
                    height: '100%',
                    padding: 5
                  }}>

                    <TouchableOpacity
                      disabled
                      style={[{ marginTop: 4, backgroundColor: 'tranparent' }]}
                    >
                      <Text style={[{
                        color: Color.black,
                        textAlign: 'justify',
                        margin: 10,
                        justifyContent: 'center'
                      }]}>You can invite your friends using a link.</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
              <View style={{
                flexDirection: 'row',
                width: '100%',
                // backgroundColor: 'red',
                position: 'absolute',
                bottom: 15,
                padding: 10,
                marginTop: 10
              }}>
                <Text style={{
                  width: '60%',
                  fontSize: 10
                }}>Transfer an amount to other wallet
                  by clicking the ‘Scan QR Code’ button.</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.setQRCodeModal(false)
                    this.props.navigation.navigate('qrCodeScannerStack');
                  }}
                  style={{
                    width: '40%',
                    backgroundColor: Color.primary,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50
                  }}
                >
                  <Text style={[{
                    color: Color.white,
                    textAlign: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    fontSize: 10
                  }]}>Scan QR Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View >
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  qrcodeModal: state.qrCodeModal
})


const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({ isVisible: isVisible })),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeModal)


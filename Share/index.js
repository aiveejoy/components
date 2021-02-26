import React, {Component} from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal} from 'react-native';
import { BottomSheet, ListItem, Card, SocialIcon, Button, Divider  } from 'react-native-elements';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCopy} from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';

class Share extends Component {
    constructor(props){
        super(props)
    }
    closeModal(){
        const { viewShare } = this.props
        console.log("false");
        viewShare(false);
    }
    render(){
        const { isViewing } = this.props.state
        return (
            <View>
                <ScrollView onScroll={() => this.closeModal}>
                <Modal visible={isViewing} animationType="slide" transparent={true} style={{backgroundColor: 'rgba(0,0,0, 0.5)'}}>
                <View style={styles.bottomNavigationView} >
                        <View
                        style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }} >
                        <View onTouchStart={() => this.closeModal()}>
                            <Divider style={{backgroundColor: 'black', marginTop: 20, width: 40, height: 1, marginLeft: 'auto', marginRight: 'auto'}} onTouchStart={() => this.closeModal()}/>
                            <Text
                                style={{
                                textAlign: 'center',
                                padding: 20,
                                fontSize: 15,
                                fontWeight: 'bold'
                                }} onPress={() => this.closeModal()}>
                                Share
                            </Text >
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5}}>
                            <Text>Click copy to clipboard</Text>
                            <TouchableOpacity>
                                <FontAwesomeIcon icon={faCopy} size={40}/>
                                <Text>Copy</Text>
                            </TouchableOpacity>
                        </View>
                        <Divider style={{backgroundColor: 'gray', marginBottom: 20, height: 1}}/>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 5,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001,
                                marginRight: 50
                            }}
                            >
                                <Image source={require('assets/social/whatsapp.png')} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                                
                            <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 5,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001
                            }}
                            >
                                <Image source={require('assets/social/gmail.png')} style={{width: 80, height: 80}}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 5,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001,
                                marginLeft: 50
                            }}
                            >
                                <Image source={require('assets/social/messenger.png')} style={{width: 80, height: 80}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 5,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001,
                                marginRight: 50
                            }}
                            >
                                <Image source={require('assets/social/twitter.png')} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 5,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001,
                            }}
                            >
                                <Image source={require('assets/social/sms.png')} style={{width: 70, height: 70}}/>
                            </TouchableOpacity>
                              <TouchableOpacity
                            style={{
                                height: 70,
                                width: 70,
                                marginLeft: 50,
                                borderColor: Color.primary,
                                borderWidth: 2,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 10001,
                            }}
                            >
                                <Image source={require('assets/social/instagram.png')} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E0F7FA',
    },
    bottomNavigationView: {
      backgroundColor: '#fff',
      width: '100%',
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      borderTopWidth: 1,
      borderColor: 'gray'

    },
  });

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    viewShare: (isViewing) => dispatch(actions.viewShare(isViewing))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Share)
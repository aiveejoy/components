import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Button from './Button.js'

function GettingCall(props){
  return (
    <View style={styles.container}>
      <Image source={{uri: 'https://www.alltimelow.com/sites/g/files/g2000006681/f/Sample-image10-highres.jpg'}} style={styles.image}/>
      <View style={styles.bContainer}> 
        <Button title={'Join'} style={styles.callBtn} onPress={props.join}/>
        <Button title={'Hangup'} style={styles.cancelBtn} onPress={props.hangup}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  bContainer: {
    flexDirection: 'row',
    bottom: 30
  },
  callBtn:{
    backgroundColor: 'green',
    marginRight: '20%'
  },
  cancelBtn:{
    backgroundColor: 'red',
  }
})

export default GettingCall;
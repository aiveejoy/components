import React, { Component } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function Button(props){
  return (
    <View>
      <TouchableOpacity onPress={props.onPress} style={[styles.btn, props.style]}>
        <Text style={styles.text}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  text: {
    color: '#fff'
  }
})

export default Button
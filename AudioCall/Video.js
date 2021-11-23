import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';
import Button from './Button.js';

function ButtonContainer(props) {
  return (
    <View style={styles.btnContainer}>
      <Button title={'Hangup'} style={styles.hangBtn} onPress={props.hangup}/>
    </View>
  );
}
export default function Video(props) {
  // const [localStream, setLocalStream] = useState({})
  if (props.localStream && !props.remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}></RTCView>
        <ButtonContainer  hangup={props.hangup}/>
      </View>
    );
  }
  if (props.localStream && props.remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}></RTCView>

        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.videoLocal}></RTCView>
        <ButtonContainer  hangup={props.hangup}/>
      </View>
    );
  }
  return <ButtonContainer hangup={props.hangup}/>;
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  hangBtn: {
    backgroundColor: 'red',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoLocal: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10
  }
});

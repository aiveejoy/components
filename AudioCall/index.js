import React, {Component} from 'react'
import { Platform } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

class AudioCall extends Component{
    state ={
      videoUrl: null,
      isFront: true
  }

  componentDidMount() {
    const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    const pc = new RTCPeerConnection(configuration);
    const {isFront} = this.state;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: Platform.OS === 'ios' ? false : {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      })
      .then(stream => {
        console.log('[STREAMING]', stream);
        this.setState({videoUrl: stream.toURL()})
        pc.addStream(stream);
      })
      .catch(error => {
        console.log('[ERROR]', error);
      });
    });

    pc.createOffer().then(desc => {
      pc.setLocalDescription(desc).then(() => {
        // Send pc.localDescription to peer
      }).catch(e => {
        console.log('[LOCAL ERROR]', e);
      }).catch(err => {
        console.log('[offer ERROR]', err);
      });
    });
    pc.onicecandidate = (event) => {
      // send event.candidate to peer
      console.log('[EVENT]', event);
    };
  }

  render() {
    return (
      <RTCView streamURL={this.state.videoUrl} style={styles.container}/>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#000'
  }
}

export default AudioCall;
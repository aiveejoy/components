import React, {useState, useRef, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {MediaStream, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import GettingCall from './GettingCall.js';
import Video from './Video.js';
import Button from './Button.js';
import audioUtils from './audioUtils.js'
import Api from 'services/api/index.js';
import firestore from '@react-native-firebase/firestore'

export default function AudioCall() {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] =useState();
  const [gettingCall, setGettingCall] = useState(false);
  const pc = useRef();
  const connecting = useRef(false);

  const configuration = {'iceServers': [{url: 'stun:stun.l.google.com:19302'}]};

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');

    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();
      
      if(pc.current && !pc.current.remoteDescription && data && data.answer){
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if(data && data.offer && !connecting.current){
        setGettingCall(true);
      }
    })

    const subscribeDelete = cRef.collection('callee').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(item => {
        if(item.type === 'removed'){
          hangup();
        }
      })
    })
    return () => {
      subscribe();
      subscribeDelete()
    }
  }, [])

  //setup webrtc
  const setupWebRtc = async() => {
    console.log('setup');
    pc.current = new RTCPeerConnection(configuration);
    const stream = await audioUtils.getStream();
    if(stream){
      console.log('[STREAM]', stream);
      setLocalStream(stream)
      pc.current.addStream(stream)
    }
    pc.current.onAddStream = (event) => {
      console.log('[ONADDSTREAM]', event);
      setRemoteStream(event.stream)
    }

    InCallManager.start({media: 'audio'});
    InCallManager.setForceSpeakerphoneOn(true);
    InCallManager.setSpeakerphoneOn(true);
  };
  //==============

  //create new connection
  const create = async () => {
    console.log('[CALLING!]');
    connecting.current = true

    await setupWebRtc();

    const cRef = firestore().collection('meet').doc('chatId')

    collectionIceCandidates(cRef, 'caller', 'callee');

    if(pc.current){
      const offer = await pc.current.createOffer();
      pc.current.setLocalDescription(offer)

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      }
      cRef.set(cWithOffer);
    }
  };
  //==============

  const join = async() => {
    console.log('[JOINING]');
    connecting.current = true;
    setGettingCall(false)

    const cRef = firestore().collection('meet').doc('chatId');
    const offer = (await cRef.get()).data()?.offer;

    if(offer){
      await setupWebRtc();

      collectionIceCandidates(cRef, 'callee', 'caller');

      if(pc.current){
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer)

        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp
          }
        }
        cRef.update(cWithAnswer);
      }
    }
  };
  const hangup = async() => {
    setGettingCall(false)
    connecting.current = false;
    streamClear()
    fireStoreClear()
    if(pc.current){
      pc.current.close();
    }
  };


  const streamClear = async() => {
    if(localStream){
      localStream.getTracks().forEach(el => el.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const fireStoreClear = async() => {
    const cRef = firestore().collection('meet').doc('chatId');
    if(cRef){
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async (item) => {
        await item.ref.delete();
      })
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async (item) => {
        await item.ref.delete();
      })
    }
    cRef.delete();
  };

  const collectionIceCandidates = async(cRef, localName, remoteName) => {
    const candidateCollection = cRef.collection(localName);
    // console.log('[COLLECTION CANDIDATES]', pc.current);
    if(pc.current){
      pc.current.onicecandidate = (event) => {
        if(event.candidate){
          // console.log('[CANDIDATE]', event.candidate);
          candidateCollection.add(event.candidate)
        }
      }
    }
    await cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach((el) => {
        if(el.type === 'added'){
          const candidate = new RTCIceCandidate(el.doc.data())
          console.log('[ICE]', candidate);
          pc.current?.addIceCandidate(candidate);
        }
      })
    })
  }

  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  if (localStream) {
    return (
      <Video
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  }
  return (
    <View style={styles.container}>
      {/* <GettingCall/> */}
      {/* <Video/> */}
      <Button title={'Call'} style={styles.callBtn} onPress={create} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '80%',
    height: '100%',
  },
  callBtn: {
    backgroundColor: 'gray',
  },
});

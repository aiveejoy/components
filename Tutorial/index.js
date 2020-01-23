import React, {Component} from 'react';
import styles from './Style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Image, TouchableHighlight} from 'react-native';
import { Helper, BasicStyles, Color } from 'common';
import Config from 'src/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';

class Tutorial extends Component {
  
  constructor(props){
    super(props);
  }

  _renderNextButton = () => {
    return (
      <View 
        style={[BasicStyles.btn, BasicStyles.secondary]}>
        <Text style={BasicStyles.textWhite}>
          Next
        </Text>
      </View>
    );
  };

  _renderFinishButton = () => {
    return (
      <View 
        style={[BasicStyles.btn, BasicStyles.secondary]}>
        <Text style={BasicStyles.textWhite}>
          Finish
        </Text>
      </View>
    );
  };

  _renderItem = ({ item, dimensions }) => (
    <LinearGradient
      colors={[Color.white, Color.white, Color.white]}
      style={styles.linearGradient}
    >
    {
      /* You can add icons here*/
    }
      <View style={{
        marginTop: 100
      }}>
        {
          item.image != null && (
            <View style={styles.imageHolder}>
              <Image source={item.image} style={styles.imageSize}/>
            </View>
          )
        }
        {
          item.icon != null && (
          <View style={styles.imageHolder}>
            <FontAwesomeIcon
              icon={item.icon}
              size={styles.iconSize}
              style={{
                color: Color.primary
              }}
              />
          </View>
          )
        }
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  );


  render () {
    return <AppIntroSlider
    slides={Helper.tutorials}
    renderItem={this._renderItem}
    bottomButton
    key={1}
    onDone={() => this.props.onFinish()}
    onSkip={() => this.props.onSkip()}
    renderNextButton={this._renderNextButton}
    renderDoneButton={this._renderFinishButton}
    />;
  }
}

export default Tutorial;

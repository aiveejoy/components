import React, {Component} from 'react';
import styles from './ModalStyle.js';
import {Text, View, TouchableOpacity, TextInput, Picker, Image} from 'react-native';
import Modal from "react-native-modal";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faStar, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import { Color , BasicStyles, Helper, Routes} from 'common';
import { Spinner } from 'components';
import Currency from 'services/Currency.js';
import Api from 'services/api/index.js';
import Config from 'src/config.js';
class StandardRatings extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      index: -1,
      comments: null
    }
  }

  submit = () => {
    const { user } = this.props.state;
    let parameter = {
      payload: this.props.data.payload,
      payload_value: this.props.data.payload_value,
      account_id: user.id,
      value: (this.state.index + 1),
      payload_1: this.props.data.payload1,
      payload_value_1: this.props.data.payload_value1,
      status: 'all',
      comments: this.state.comments == null || this.state.comments == '' ? null : this.state.comments
    }
    console.log('rating', parameter);
    this.setState({isLoading: true});
    Api.request(Routes.ratingsCreate, parameter, response => {
      this.setState({isLoading: false});
      this.props.action(true)
    });
  }

  close = () => {
    this.props.action(false)
  }


  _ratings = () => {
    const { userLedger } = this.props.state;
    let stars = []
    for(let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity onPress={() => this.setState({index: i})}>
          <FontAwesomeIcon
          icon={ i <= this.state.index ? faStar : faStarRegular}
          size={50}
          style={{
            color: Color.warning
          }}
          key={i}
          />
        </TouchableOpacity>
      )
    }
    return (
      <View style={{
        width: '100%'
      }}>
        <View style={{
          alignItems: 'center'
        }}>
        
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
          flexDirection: 'row' 
        }}>
        {
          stars
        }
        </View>
        <View style={{
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20
        }}>
          <Text style={{
            paddingTop: 20,
            paddingBottom: 20,
          }}>Comments</Text>
          <TextInput
            style={{
              borderColor: Color.gray,
              borderWidth: 1,
              width: '100%',
              marginBottom: 20,
              borderRadius: 5,
              textAlignVertical: 'top'
            }}
            onChangeText={(comments) => this.setState({comments})}
            value={this.state.comments}
            placeholder={'Type your comment/s here...'}
            multiline = {true}
            numberOfLines = {10}
          />
        </View>
        </View>
      </View>
    );
  }


  render(){
    const { isLoading } = this.state;
    return (
      <View>
        <Modal isVisible={this.props.visible}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <View style={styles.header}>
                <View style={{
                  width: '70%'
                }}
                >
                  <Text style={styles.text}>{this.props.title}</Text>
                </View>
                <View style={{
                  width: '30%',
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity onPress={() => this.close()} style={styles.close}>
                    <FontAwesomeIcon icon={ faTimes } style={{
                      color: Color.danger
                    }} size={BasicStyles.iconSize} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.content}>
                {this._ratings()}
              </View>
              <View style={[styles.action, {flexDirection: 'row'}]}>
                <View style={{
                  width: '50%',
                  alignItems: 'center'
                }}>
                  <TouchableOpacity 
                    onPress={() => this.close()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.danger
                    }]}>{this.props.actionLabel.no}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{
                  width: '50%',
                  alignItems: 'center',
                  borderLeftColor: Color.gray,
                  borderLeftWidth: 1
                }}>
                  <TouchableOpacity 
                    onPress={() => this.submit()}
                    underlayColor={Color.gray}
                    >
                    <Text style={[styles.text, {
                      color: Color.primary
                    }]}>{this.props.actionLabel.yes}</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>
          </View>
          {isLoading ? <Spinner mode="overlay"/> : null }
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
)(StandardRatings);

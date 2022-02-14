import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions } from 'react-native';
import { Routes, Color, BasicStyles } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import _ from 'lodash';
import Style from './CreateStyle';
import { Spinner } from 'components';
import RBSheet from 'react-native-raw-bottom-sheet';
import PostCard from './PostCard';

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);
class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      loading: false,
      errorMessage: null
    }
  }

  componentDidUpdate() {
    const { visible } = this.props
    if (visible) {
      this.RBSheet.open()
      return;
    }
  }

  statusHandler = (value) => {
    this.setState({ status: value })
  }

  post = async () => {
    const { data } = this.props;
    const { status } = this.state;
    if (status === '' || status === null) {
      this.setState({ errorMessage: 'Empty Status!' })
      return
    } else {
      this.setState({errorMessage: null})
    }
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id,
      text: status,
      comment_id: data.id
    }
    this.setState({ loading: true })
    console.log(Routes.sharePostCreate, parameter);
    Api.request(Routes.sharePostCreate, parameter, response => {
      console.log(response, 'share');
      this.setState({ loading: false })
      if (response.data > 0) {
        let par = {
          created_at: data.created_at,
          account_id: data.account_id,
          payload: 'share_post_id',
          payload_value: response.data,
          text: data.text,
          to: user.id,
          from: user.id,
          route: 'statusStack'
        }
        console.log(Routes.commentsCreate, par);
        Api.request(Routes.commentsCreate, par, res => {
          console.log(res, 'comments');
          this.setState({ loading: false })
          if (res.data > 0) {
            this.props.close()
            this.RBSheet.close()
          }
        })
      }
    })
  }

  render() {
    const { theme } = this.props.state;
    const { data } = this.props;
    const { loading, errorMessage } = this.state;
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          closeOnPressMask={false}
          height={height / 2 + (height / 4)}
          onClose={() => {
            this.props.close()
          }}
        >
          <View style={Style.centeredView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={[Style.container], {
                padding: 20,
                marginBottom: height/2
              }}>
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: BasicStyles.standardTitleFontSize
                }}>{this.props.title}</Text>
                <Text style={{
                  color: Color.danger
                }}>{errorMessage}</Text>
                <TextInput
                  style={{
                    width: '100%',
                  }}
                  multiline={true}
                  onChangeText={text => this.statusHandler(text)}
                  value={this.state.status}
                  placeholder="Express what's on your mind..."
                  placeholderTextColor={Color.darkGray}
                />
                <PostCard
                  data={data}
                  images={data.images}
                  showImages={() => { return }}
                  style={{
                    backgroundColor: 'white',
                  }}
                  share={false}
                />
              </View>
            </ScrollView>
            {loading ? <Spinner mode="overlay" /> : null}
            <View style={{
              flexDirection: 'row-reverse',
              padding: 20,
              position: 'absolute',
              bottom: 5,
              width: width
            }}>
              <TouchableOpacity style={[Style.button, {
                borderColor: theme ? theme.primary : Color.primary,
                backgroundColor: theme ? theme.primary : Color.primary
              }]}
                onPress={() => { this.post() }}
              >
                <Text style={{ color: 'white' }}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[Style.button, {
                borderColor: Color.secondary,
                backgroundColor: Color.secondary,
                marginRight: 5,
              }]}
                onPress={() => {
                  this.props.close();
                  this.RBSheet.close()
                  this.setState({
                    status: null,
                    list: []
                  });
                }}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Share);
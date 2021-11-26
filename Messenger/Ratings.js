import React, { Component } from 'react';
import { View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as Solid } from '@fortawesome/free-solid-svg-icons';
import { faStar as Regular } from '@fortawesome/free-regular-svg-icons';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { Routes } from 'common';
import { Spinner } from 'components';
import styles from 'modules/reviews/Styles.js';
const height = Math.round(Dimensions.get('window').height);
import Skeleton from 'components/Loading/Skeleton';

class Ratings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStar: 0,
      isLoading: false,
      comment: '',
      data: null,
      status: 'create'
    };
  }

  componentDidMount = () => {
    this.retrieve()
  }

  retrieve = () => {
    const { data, members } = this.props;
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        clause: '=',
        value: user.id
      }, {
        column: 'payload',
        clause: '=',
        value: 'account'
      }, {
        column: 'payload_value',
        clause: '=',
        value: members[0]?.account_id === user.id ? members[1]?.account_id : members[0]?.account_id
      }, {
        column: 'payload_value_1',
        clause: '=',
        value: data.id
      }, {
        column: 'payload_1',
        clause: '=',
        value: 'request'
      }],
      account_id: user.id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.ratingsRetrieveById, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data && response.data.length > 0) {
        this.setState({
          status: 'update',
          data: response.data[0],
          comment: response.data[0].comments,
          selectedStar: parseInt(response.data[0].value)
        })
      } else {
        this.setState({
          status: 'create',
          data: null,
          comment: null,
          selectedStar: 0
        })
      }
    },
      (error) => {
        this.setState({ isLoading: false, data: null });
      }
    );
  }

  updateUserRating = () => {
    const { data, members } = this.props;
    const { user, requests } = this.props.state;
    if (user == null || data == null) {
      Alert.alert(
        "Try Again",
        'Invalid request of page.',
        [
          {
            text: "Ok", onPress: () => {
              this.props.navigation.pop()
            }
          }
        ],
        { cancelable: false }
      );
      return
    }
    let parameter = {
      condition: [{
        column: 'payload',
        clause: '=',
        value: 'account'
      }, {
        column: 'payload_value',
        clause: '=',
        value: members[0]?.account_id === user.id ? members[1]?.account_id : members[0]?.account_id
      }],
      account_id: user.id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.ratingsRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        requests.length > 0 && requests.map((item, index) => {
          if (data.id == item.id && data.account_id != user.id) {
            item['rating']['avg'] = response?.avg;
            item['rating']['stars'] = response?.stars;
            console.log(item.rating, '-----udpated rating---')
          }
        })
        this.props.navigation.pop();
      }
    },
      (error) => {
        this.setState({ isLoading: false });
      }
    );
  }

  retrieveUser = (id) => {
    let parameter = {
      condition: [{
        column: 'id',
        value: id,
        clause: '='
      }]
    }
    Api.request(Routes.accountRetrieve, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data.length > 0) {
        this.setState({
          data: response.data[0]
        })
      } else {
        this.setState({
          data: null
        })
      }
    },
      (error) => {
        this.setState({ isLoading: false });
      }
    );
  }

  submit = (star) => {
    const { data, members } = this.props;
    const { user } = this.props.state;
    if (user == null || data == null) {
      Alert.alert(
        "Try Again",
        'Invalid request of page.',
        [
          {
            text: "Ok", onPress: () => {
              this.props.navigation.pop()
            }
          }
        ],
        { cancelable: false }
      );
      return
    }
    let parameters = {
      account_id: user.id,
      payload: 'account',
      payload_value: members[0]?.account_id == user.id ? members[1]?.account_id : members[0]?.account_id,
      payload_1: 'request',
      payload_value_1: data.id,
      comments: this.state.comment,
      value: star,
      status: 'full'
    };
    this.setState({ isLoading: true });
    console.log(members)
    Api.request(Routes.ratingsCreate, parameters, response => {
      this.setState({ isLoading: false })
      this.updateUserRating();
    },
      (error) => {
        this.setState({ isLoading: false });
      },
    );
  };

  update = (star) => {
    const { data, members } = this.props;
    const { user } = this.props.state;
    let parameters = {
      id: this.state.data.id,
      account_id: user.id,
      payload: 'account',
      payload_value: members[0]?.account_id == user.id ? members[1]?.account_id : members[0]?.account_id,
      payload_1: 'request',
      payload_value_1: data.id,
      comments: this.state.comment,
      value: star,
      status: 'full',
    };
    this.setState({ isLoading: true });
    console.log('parameters', parameters)
    Api.request(Routes.ratingsUpdate, parameters, response => {
      this.setState({ isLoading: false })
      this.updateUserRating();
    },
      (error) => {
        this.setState({ isLoading: false });
      },
    );
  };

  renderStars = () => {
    const starsNumber = [1, 2, 3, 4, 5];
    return starsNumber.map((star, index) => {
      return this.state.selectedStar > index ? (
        <TouchableOpacity
          onPress={() => {
            this.setState({ selectedStar: index + 1 });
            if (this.state.data !== null) {
              this.update(index + 1)
            } else {
              this.submit(index + 1)
            }
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Solid}
            size={35}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            this.setState({ selectedStar: index + 1 });
            if (this.state.data !== null) {
              this.update(index + 1)
            } else {
              this.submit(index + 1)
            }
          }}
          key={index}
          style={styles.StarContainer}>
          <FontAwesomeIcon
            color={'#FFCC00'}
            icon={Regular}
            size={35}
            style={{
              color: '#FFCC00',
            }}
          />
        </TouchableOpacity>
      );
    });
  };

  handleComment = (value) => {
    this.setState({ comment: value });
  };

  renderUserInfo(account) {
    return (account?.information && account?.information.length > 0 && account?.information[0].first_name !== null) ? account.information.first_name + ' ' + account.information.last_name : account.username;
  }

  render() {
    const { data } = this.props;
    const { isLoading } = this.state;
    return (
      <View>
          {(data && isLoading == false) && <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10
          }}>{this.renderStars()}</View>}
          
        {isLoading && (<Skeleton size={1} template={'block'} height={50 } />)}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ratings);

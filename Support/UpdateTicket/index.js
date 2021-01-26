import React, {Component} from 'react';
import {View, Picker, Text, ScrollView, TextInput, TouchableOpacity, Image} from 'react-native';
import styles from 'modules/createTicket/Styles.js';
import Api from 'services/api/index.js';
import { Routes, BasicStyles } from 'common';
import ImagePicker from 'react-native-image-picker';
import TicketButton from 'modules/createTicket/TicketButton.js';
import Dropdown from 'components/InputField/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import Color from 'common/Color';
import { Spinner } from 'components';
class CreateTicket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      type: null,
      id: null,
      assignees: [],
      assignee: null,
      status: null,
      isLoading: false,
      images: [],
    };
  }

  componentDidMount() {
    this.retrieve();
    this.retrieveAssignees();
  }

  retrieve() {
    let parameter = {
      condition: [{
        value: this.props.navigation.state.params.id,
        column: 'id',
        clause: '='
      }]
    };
    this.setState({isLoading: true})
    Api.request(Routes.ticketsRetrieve, parameter, tickets => {
      this.setState({isLoading: false})
      if (tickets.data.length != 0) {
        this.setState({title: tickets.data[0].content})
        this.setState({description: tickets.data[0].content})
        this.setState({type: tickets.data[0].type})
        this.setState({id: tickets.data[0].id})
        this.setState({images: tickets.data[0].images.split(' ')})
      }
    })
  }

  retrieveAssignees() {
    let parameter = {
      condition: [{
        value: 'USER',
        column: 'account_type',
        clause: '!='
      }]
    }
    this.setState({isLoading: true})
    Api.request(Routes.accountRetrieve, parameter, accounts => {
      this.setState({isLoading: false})
      if(accounts.data.length > 0) {
        let data = []
        accounts.data.map((item) => {
          let assignee = {
            title: item.username,
            value: item.id
          }
          data.push(assignee)
        })
        this.setState({assignees: data})
      }
    })
  }

  selectedValue = value => {
    this.setState({type: value});
  };

  selectedAssignee = value => {
    this.setState({assignee: value});
  };

  selectedStatus = value => {
    this.setState({status: value});
  };

  update() {
    let parameter = {
      id: this.state.id,
      content: this.state.title,
      type: this.state.type,
      assigned_to: this.state.assignee,
      status: this.state.status
    };
    this.setState({isLoading: true})
    Api.request(Routes.ticketsUpdate, parameter, tickets => {
      this.setState({isLoading: false})
      if (tickets.data == true) {
        this.props.navigation.push('supportStack');
      }
    })
  }

  choosePhoto = () => {
    const options = {
      noData: false,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        let images = this.state.images;
        images.push(`data:image/png;base64,${response.data}`);
        this.setState({ images: images });
      } else {
        this.setState({ photo: null });
      }
    })
  }

  render() {
    let data = [{title: 'Bug', value: 'bug'}, {title: 'Question', value: 'question'}, {title: 'Enhancement', value: 'enhancement'}, {title: 'Invalid', value: 'invalid'}, {title: 'Duplicate', value: 'duplicate'}, {title: 'Help wanted', value: 'help wanted'}]
    let status = [{title: 'Pending', value: 'pending'}, {title: 'Open', value: 'open'}, {title: 'Closed', value: 'closed'}]
    return (
      <View style={styles.CreateTicketContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
        <View style={styles.InputContainer}>
        <Text>Title</Text>
        <TextInput
          style={BasicStyles.formControl}
          onChangeText={(title) => this.setState({title})}
          value={this.state.title}
          placeholder={'Title'}
        />
        </View>
        <View style={styles.InputContainer}>
        <Text>Description</Text>
        <TextInput
          style={BasicStyles.formControl}
          onChangeText={(description) => this.setState({description})}
          value={this.state.description}
          placeholder={'Description'}
        />
        </View>
        <View style={styles.InputContainer}>
          <Text>Assignee</Text>
          <Dropdown selectedValue={this.state.assignee} onChange={this.selectedAssignee} data={this.state.assignees}></Dropdown>
        </View>
        <View style={styles.InputContainer}>
          <Text>Type</Text>
          <Dropdown selectedValue={this.state.type} onChange={this.selectedValue} data={data}></Dropdown>
        </View>
        <View style={styles.InputContainer}>
          <Text>Status</Text>
          <Dropdown selectedValue={this.state.status} onChange={this.selectedStatus} data={status}></Dropdown>
        </View>
        {this.state.isLoading ? <Spinner mode="overlay"/> : null }
        <View style={styles.InputContainer}>
              {this.state.images.map((u, i) => {
                return (
                  <View key={i} style={{flexDirection: 'row'}}>
                    <Image
                      source={{ uri: u }}
                      style={styles.Image}
                    />
                  </View>
                )
              })}
              <TouchableOpacity
                onPress={() => {
                  this.choosePhoto();
                }}>
                <FontAwesomeIcon
                  icon={faImages}
                  style={{
                    color: Color.gray, marginRight: 5
                  }}
                  size={50}
                />
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.TicketButtonContainer}>
          <TicketButton
            buttonColor="#22B173"
            buttonWidth="100%"
            buttonHeight={50}
            fontSize={14}
            textColor="#FFFFFF"
            buttonText="Create Ticket"
            onPress={this.update.bind(this)}
          />
        </View>
        </ScrollView>
      </View>
    );
  }
}

export default CreateTicket;

import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput } from 'react-native';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Input extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { theme, user } = this.props.state;
		return (
			<View style={{
				width: this.props.width
			}}>
				<Text style={{fontFamily: 'Poppins-SemiBold'}}>{this.props.label}&nbsp;
					<Text style={{color: Color.danger}}>*</Text>
				</Text>
				<View style={{
					width: '100%',
					height: 50,
					borderRadius: 50,
					backgroundColor: 'white',
					backgroundColor: Color.white,
					borderColor: Color.gray,
					borderWidth: 0.25,
					marginTop: 20
				}}>
					<TextInput
						placeholder={this.props.placeholder}
						style={{
							padding: 10,
							textAlign: 'center'
						}}
					/>
				</View>
			</View>
		);
	}
}
const mapStateToProps = state => ({ state: state });

export default connect(
	mapStateToProps
)(Input);
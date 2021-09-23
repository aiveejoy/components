
import Input from './Input';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
import styles from './Style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressCard, faCreditCard, faWallet } from '@fortawesome/free-solid-svg-icons';

class Options extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { theme, user } = this.props.state;
		return (
			<View>
			<ScrollView>
				<View style={{
					flexDirection: 'row',
					width: '100%'
				}}>
					<View style={[styles.Button, {
						width: '47%',
						backgroundColor: 'white',
						flexDirection: 'row',
						backgroundColor: theme ? theme.primary : Color.primary,
						marginRight: '6%'
					}]}>
						<FontAwesomeIcon
							icon={faWallet}
							style={{
								marginRight: 5,
								color: 'white'
							}}
						/>
						<Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold' }}>From Wallet</Text>
					</View>
					<View style={[styles.Button, {
						width: '47%',
						flexDirection: 'row',
						marginRight: '6%'
					}]}>
						<FontAwesomeIcon
							icon={faCreditCard}
							style={{
								marginRight: 5
							}}
						/>
						<Text style={{ fontFamily: 'Poppins-SemiBold' }}>Paypal</Text>
					</View>
					<View style={[styles.Button, {
						width: '47%',
						backgroundColor: 'white',
						flexDirection: 'row'
					}]}>
						<FontAwesomeIcon
							icon={faAddressCard}
							style={{
								marginRight: 5
							}}
						/>
						<FontAwesomeIcon
							icon={faCreditCard}
							style={{
								marginRight: 5
							}}
						/>
						<Text style={{ fontFamily: 'Poppins-SemiBold' }}>CC/DC</Text>
					</View>
				</View>
			</ScrollView>
			</View>
		);
	}
}
const mapStateToProps = state => ({ state: state });

export default connect(
	mapStateToProps
)(Options);
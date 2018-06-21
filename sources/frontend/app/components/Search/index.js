/**
*
* Search
*
*/

import React, {Component} from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Paper from 'material-ui/Paper';
import {red600} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import ActionSearch from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	icon: {
		left: '10px',
		position: 'absolute',
		top: '13px',
	},
	root: {
		position: 'relative',
		width: '100%',
	},
	search: {
		boxSixing: 'border-box',
		display: 'inline-block',
		margin: '0 auto',
		padding: '8px 8px 8px 40px',
		width: 'calc(100% - 300px)',
	},
	searchInput: {
		borderRadius: 2,
		margin: 0,
	},
	select: {
		float: 'right',
		marginRight: 5,
		verticalAlign: 'middle',
		width: 138,
	},
	cuisine: {
		float: 'right',
		marginRight: 8,
		marginTop: 6,
		verticalAlign: 'middle',
		width: 100,
	},
};


class Search extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	
	state = {
		foodType: "main course", 
	};

	static propTypes = {
		onFoodTypeChange: React.PropTypes.func,
		cuisineHandle: React.PropTypes.func,
	};
	
	//onMealTypeChange = (event,value) => {
	//	this.props.onFoodTypeChange(value);
	//}
	
	//var Checkbox = require('../Checkbox')
	//var Example = React.createFactory(React.createClass({displayName: 'Example',
	//	getInitialState: function () 
	//		return {
	//			color: null,
	//			colors: []
	//		}
	//	},
	
	
	render() {
		return (
			<Paper style={styles.root} zDepth={1}>
				<TextField
					hintText={<FormattedMessage {...messages.hint} />}
					style={styles.search}
					inputStyle={styles.searchInput}
					underlineShow={false}
				/>
				<SelectField
					onChange={this.handleFoodChange}
					style={styles.select}
					underlineShow={false}
					value={this.state.foodType}
				>
					<MenuItem value="main course" primaryText="Main course" />
					<MenuItem value="side dish" primaryText="Side dish" />
					<MenuItem value="dessert" primaryText="Dessert" />
					<MenuItem value="appetizer" primaryText="Appetizer" />
					<MenuItem value="salad" primaryText="Salad" />
					<MenuItem value="bread" primaryText="Bread" />
					<MenuItem value="breakfast" primaryText="Breakfast" />
				</SelectField>
				<FlatButton
					label="Cuisine"
					onTouchTap={this.props.cuisineHandle}
					style={styles.cuisine}
				/>
				<ActionSearch color="#ddd" style={styles.icon} />
			</Paper>
			
		);
	}

	handleFoodChange = (event, index, value) => {
		this.setState({foodType: value});
		this.props.onFoodTypeChange(value);
	}

}

export default Search;

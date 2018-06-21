/**
*
* ConfigCuisine
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';

const styles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	list: {
		width: 360,
	}
};

class ConfigCuisine extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	static propTypes = {
		onCuisineChange: React.PropTypes.func,
	};

	state = {
		index: 0,
		cuisine: "Mexican", 
		isInputChecked: false,
	};

	renderCuisines() {
		const cuisines = ['African', 'American', 'British', 'Cajun', 'Caribbean',
			'Chinese', 'Eastern European', 'French', 'German', 'Greek', 'Indian',
			'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
			'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai',
			'Vietnamese'];
		return cuisines.map((cuisine, index) => (
			<ListItem
				key={index}
				leftCheckbox={
					<Checkbox onCheck={this.handleCuisineChange} value={cuisine} />
				}
				primaryText={cuisine}
			/>
		));
	}

	render() {
		return (
			<List style={styles.list}>
				<Subheader><FormattedMessage {...messages.header} /></Subheader>
				{this.renderCuisines()}
			</List>
		);
	}

	handleCuisineChange = (event, isInputChecked) => {
		if(isInputChecked){
			this.setState({cuisine: event.target.value});
			this.props.onCuisineChange(event.target.value);
		}
	}
}

export default ConfigCuisine;

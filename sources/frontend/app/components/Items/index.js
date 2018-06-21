/**
*
* Ingredients
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import {red600} from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import Ingredient from '../Ingredient';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
	header: {
		color: red600,
		fontSize: 20,
		fontWeight: 400,
		marginBottom: 10,
		paddingLeft: 0,
	},
	flexContainer: {
		backgroundColor: '#f6f6f6',
		borderBottom: '1px solid #eee',
		borderRadius: 2,
		display: 'flex',
		flexWrap: 'wrap',
	}
};

class Items extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	static propTypes = {
		title: React.PropTypes.string,
	};

	render() {
		if (this.props.children.length == 0)
			return null;

		return (
			<div>
				<Subheader style={styles.header}>{this.props.title}</Subheader>
				<div style={styles.flexContainer}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Items;

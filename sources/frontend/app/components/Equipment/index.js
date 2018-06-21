/**
*
* Equipment
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = {
	image: {
		backgroundPosition: 'center center',
		backgroundSize: 'contain',
		display: 'block',
		height: 40,
		margin: 'auto',
		width: 120,
	},
	info: {
		dislay: 'block',
		lineHeight: '40px',
		textAlign: 'center',
	},
	name: {
		color: 'black',
		display: 'block',
		fontSize: 15,
	},
	root: {
		flexBasis: 'auto',
		margin: 10,
	}
};

class Equipment extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	
	static propTypes = {
		name: React.PropTypes.string.isRequired,
		image: React.PropTypes.string,
	};

	render() {
		let copy = JSON.parse(JSON.stringify(styles.image));
		copy.backgroundImage = `url(${this.props.image})`;

		return (
			<div style={styles.root}>
				<div style={copy} />
				<div style={styles.info}>
					<span style={styles.name}>{this.props.name}</span>
				</div>
			</div>
		);
	}
}

export default Equipment;

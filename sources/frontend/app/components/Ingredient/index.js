/**
*
* Ingredient
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = {
	image: {
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		borderRadius: '50%',
		display: 'inline-block',
		float: 'left',
		height: 40,
		width: 40,
	},
	info: {
		dislay: 'inline-block',
		float: 'left',
		paddingLeft: 5,
	},
	name: {
		color: 'black',
		display: 'block',
		fontSize: 15,
	},
	quantity: {
		color: 'gray',
		display: 'block',
		fontSize: 12,
	},
	root: {
		flexBasis: 'auto',
		margin: 10,
	}
};

class Ingredient extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	static propTypes = {
		name: React.PropTypes.string.isRequired,
		image: React.PropTypes.string,
		quantity: React.PropTypes.number,
		unit: React.PropTypes.string,
	};

	render() {
		let copy = JSON.parse(JSON.stringify(styles.image));
		copy.backgroundImage = `url(${this.props.image})`;

		if (!this.props.quantity)
			styles.name.marginTop = 10;

		return (
			<div style={styles.root}>
				<div style={copy} />
				<div style={styles.info}>
					<span style={styles.name}>{this.props.name}</span>
					{this.props.quantity && (
						<span style={styles.quantity}>
							{this.props.quantity + " " + this.props.unit}
						</span>
					)}
				</div>
			</div>
		);
	}
}

export default Ingredient;

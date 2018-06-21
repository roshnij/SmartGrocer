/**
*
* Diners
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = {
	root: {
		padding: 20,
		textAlign: 'center',
	}
};

class Diners extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div style={styles.root}>
				<FormattedMessage {...messages.header} />
			</div>
		);
	}
}

export default Diners;

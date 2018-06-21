/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import {red600} from 'material-ui/styles/colors';
import messages from './messages';

const styles = {
	content: {
		boxSizing: 'border-box',
		display: 'block',
		margin: '20px auto',
		padding: 50,
		minHeight: 100,
		textAlign: 'center',
		width: '100%',
	},
	link: {
		color: red600,
		textDecoration: 'none',
	}
};

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<Grid style={styles.root}>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Paper style={styles.content}>
							<h2><FormattedMessage {...messages.header} /></h2>
							<span>Go to the <a href="/" style={styles.link}>homepage</a></span>
						</Paper>
					</Col>
				</Row>
			</Grid>
		);
	}
}

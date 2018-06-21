/*
 *
 * HistoryPage
 *
 */

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const styles = {
	content: {
		boxSizing: 'border-box',
		display: 'block',
		margin: '20px auto',
		padding: 20,
		minHeight: 100,
		width: '100%',
	},
};

export class HistoryPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<Grid style={styles.root}>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Paper style={styles.content}>
							<FormattedMessage {...messages.header} />
						</Paper>
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default HistoryPage;

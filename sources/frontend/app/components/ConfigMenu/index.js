/**
*
* ConfigMenu is an off-canvas list of configuration options.
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

class ConfigMenu extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	
	static propTypes = {
		onTouchTap: React.PropTypes.func,
	};

	render() {
		return (
			<div style={styles.root}>
				<List style={styles.list}>
					<Subheader><FormattedMessage {...messages.general} /></Subheader>
					<ListItem
						primaryText={<FormattedMessage {...messages.profile} />}
						secondaryText="Add personal preferences to your profile"
					/>
					<ListItem
						primaryText="Show your status"
						secondaryText="Your status is visible to everyone you use with"
					/>
				</List>
				<Divider />
					<List style={styles.list}>
						<Subheader>Priority Interruptions</Subheader>
						<ListItem primaryText="Reminders" rightToggle={<Toggle />} />
						<ListItem primaryText="Messages" rightToggle={<Toggle />} />
					</List>
				<Divider />
				<List style={styles.list}>
					<Subheader>Hangout Notifications</Subheader>
					<ListItem
						leftCheckbox={<Checkbox />}
						primaryText="Notifications"
						secondaryText="Allow notifications"
					/>
					<ListItem
									leftCheckbox={<Checkbox />}
						primaryText="Sounds"
						secondaryText="Hangouts message"
					/>
				</List>
			</div>
		);
	}
}

export default ConfigMenu;

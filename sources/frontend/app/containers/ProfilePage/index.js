/*
 *
 * ProfilePage
 *
 */

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Toggle from 'material-ui/Toggle';
//import FB from 'fb'; // or, 
//import {FB, FacebookApiException} from 'fb';
//import graph from 'fb-react-sdk';
//import {ypi} from 'youtube-playlist-info';
//import {fs} from 'fs-access'
//import {youtube} from 'youtube-api'

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

export class ProfilePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		showYoutubeLikes: true,
		showFacebookLikes: true
		
	};
	render() {
		return (
			<Grid style={styles.root}>
				<Paper style={styles.content}>
					<Row>
						<Col xs={12} sm={12} md={12} lg={12}>
							<Toggle
										defaultToggled={!this.state.showPersonalization}
										label="Personalization"
										labelStyle={styles.toggleLabel}
										onToggle={this.personalizationAccess}
										style={styles.toggle}
									/>
							<Row>
								<Col xs={4} sm={4} md={4} lg={12}>
									<Toggle
										defaultToggled={!this.state.showYoutubeLikes}
										label="YouTube"
										labelStyle={styles.toggleLabel}
										onToggle={this.youtubeAccess}
										style={styles.toggle}
									/>	
								</Col>
							</Row>
							<Row>
								<Col xs={12} sm={12} md={4} lg={12}>
									<Toggle
										defaultToggled={!this.state.showFacebookLikes}
										label="Facebook"
										labelStyle={styles.toggleLabel}
										onToggle={this.facebookAccess}
										style={styles.toggle}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Paper>	
			</Grid>
		);
	}
	youtubeAccess = (e) => {
		this.setState({showYoutubeLikes: !this.state.showYoutubeLikes});
		//this.renderYoutube(this.state.showYoutubeLikes);
	};
	facebookAccess = (e) => {
		this.setState({showFacebookLikes: !this.state.showFacebookLikes});
		//this.renderFacebook(this.state.showFacebookLikes);
		
	};
	personalizationAccess = (e) => {
		this.setState({showPersonalization: !this.state.showPersonalization});
		//this.renderYoutube(this.state.showYoutubeLikes);
	};
	
	/*renderFacebook(likes){
		console.log(likes);
		if(likes)
			return(
				graph.setVersion("2.8"),
				graph.setAccessToken("EAACEdEose0cBADZApXw3DA43ulriLLTZCTvJ1aAUdjvSJxizuI96qIMNrzuCqN6Kp4rJBKiHxKOmhPKWFRUHntx		dGDFstpYk3eVbMYZQmFqCdDODx48YZC95RXLsGGDZCsZCGNPIhZA86yriDdKkgzTEhnEHASwUe5WcVHizjzlAnYTxv4sUraHGwKYJbYQLAZD"),
				graph.get("/me/likes", function(err, res) {
					console.log(res);
				})
			);
	}
	renderYoutube(ylikes){
		if(ylikes)
			return(
				ypi.playlistInfo("4/Z1cZCRyCdBvOTNHRluFgflEkWziIUhy2fz6SYlrGpMU", 
								"LL_NvHWLv93Jt3JFpXiRwXFg", function(playlistItems) {
					console.log(playlistItems);
				})
			);
	}*/
}

export default ProfilePage;

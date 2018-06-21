/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red600} from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import ConfigMenu from '../../components/ConfigMenu';
import ConfigCuisine from '../../components/ConfigCuisine';
import Search from '../../components/Search';
import Diners from '../../components/Diners';
import UserMenu from '../../components/UserMenu';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import {StickyContainer, Sticky} from 'react-sticky';
import {Grid, Row, Col} from 'react-flexbox-grid';
import HomePage from '../HomePage';
import ShoppingList from '../ShoppingList';

const styles = {
	appBar: {
		zIndex: 1,
	},
	drawer: {
		border: '1px solid rgb(217, 217, 217)',
		borderTop: 'none',
		borderBottom: 'none',
	},
	search: {
		margin: '-56px auto 8px auto',
		maxWidth: 960,
		position: 'relative',
		width: '50%',
		zIndex: 2,
	},
	title: {
		color: 'white',
		textDecoration: 'none',
	}
};

const muiTheme = getMuiTheme({
	palette: {
		primary1Color: red600,
	},
});

export default class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

	state = {
		logged: true,
		configOpen: false,
		dinersOpen: false,
		cuisineOpen: false,
	};

	static propTypes = {
		children: React.PropTypes.node,
	};

	handleConfigToggle = () => this.setState({configOpen: !this.state.configOpen});
	handleDinersToggle = () => this.setState({dinersOpen: !this.state.dinersOpen});
	handleCuisineToggle = () => this.setState({cuisineOpen: !this.state.cuisineOpen});

	render() {
		const userMenu = (
			<UserMenu
				configHandle={this.handleConfigToggle}
				dinersHandle={this.handleDinersToggle}
				logged={this.state.logged}
			/>
		);
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<StickyContainer>
					<AppBar
						iconElementLeft={<IconButton><NavigationMenu /></IconButton>}
						iconElementRight={userMenu}
						onLeftIconButtonTouchTap={this.handleConfigToggle}
						style={styles.appBar}
						title={<a href="/" style={styles.title} title="Home">SmartGrocer</a>}
						zDepth={0}
					/>
					<Drawer
						docked={false}
						key="config-drawer"
						open={this.state.configOpen}
						onRequestChange={(configOpen) => this.setState({configOpen})}
						style={styles.drawer}
						width={360}
					>
						<ConfigMenu />
					</Drawer>
					<Drawer
						docked={false}
						key="diners-drawer"
						open={this.state.dinersOpen}
						onRequestChange={(dinersOpen) => this.setState({dinersOpen})}
						style={styles.drawer}
						width={360}
					>
						<Diners />
					</Drawer>
					<Drawer
						docked={false}
						key="cuisine-drawer"
						open={this.state.cuisineOpen}
						onRequestChange={(cuisineOpen) => this.setState({cuisineOpen})}
						style={styles.drawer}
						width={360}
					>
						<ConfigCuisine 
							onCuisineChange={this.onCuisineChange}
						/>
					</Drawer>
					<Grid style={styles.search}>
						<Row>
							<Col xs={12} sm={12} md={12} lg={12}>
								<Search
									cuisineHandle={this.handleCuisineToggle}
									onFoodTypeChange={this.onFoodTypeChange}

								/>
								
							</Col>
						</Row>
					</Grid>
					
					{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
						foodType: this.state.foodType,
						cuisine: this.state.cuisine,
						//missedIngredientsList: this.state.missedIngredientsList
					}))}
				</StickyContainer>
			</MuiThemeProvider>
		);
	}
	onFoodTypeChange = (value) =>{
		//console.log(value);
		this.setState({foodType: value});
	};
	/*onaddIngredients = (value) =>{
		//console.log("app/end");
		console.log("data in sl: " + JSON.stringify(value));
		//this.setState({cuisine: value});
	};*/
	onCuisineChange = (value) =>{
		//console.log("app/end");
		//console.log(value);
		this.setState({cuisine: value});
	};
	
}

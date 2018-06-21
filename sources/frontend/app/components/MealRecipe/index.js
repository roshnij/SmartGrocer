/**
*
* RecipeSummary
*
*/

import React from 'react';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import {red600} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardTitle, CardMedia, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Ingredient from '../Ingredient';
import Items from '../Items';
import Dialog from 'material-ui/Dialog';
import {Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';

const styles = {
	card: {
		boxShadow: '0 1px 4px 0 rgba(0,0,0,0.14)',
		marginBottom: 15,
		verticalAlign: 'text-top',
	},
	cost: {
		color: 'white',
		display: 'block',
		fontSize: 9,
		opacity: 0,
		padding: '0px 0px 0 0px',
		textAlign: 'right',
		textShadow: '1px 1px 0 rgba(0, 0, 0, 0.7)',
	},
	dialogContent: {
		//width: 'auto',
	},
	favorite: {
		float: 'right',
		height: 24,
		padding: 0,
		width: 24,
	},
	ingredients: {
		background: 'rgb(249, 249, 249)',
		border: '2px solid #ddd',
		borderLeft: 'none',
		borderRight: 'none',
	},
	link: {
		color: 'black',
		textDecoration: 'none',
	},
	media: {
		cursor: 'zoom-in',
	},
	overlayTitle: {
		color: 'white',
		display: 'block',
		fontSize: 9,
		padding: '0 10px 10px 10px',
	},
	title: {
		boxOrient: 'vertical',
		fontSize: 9,
		fontWeight: 'normal',
		height: 25,
		lineHeight: '15px',
		overflow: 'hidden',
	},
};

class MealRecipe extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	static propTypes = {
		id: React.PropTypes.number.isRequired,
		title: React.PropTypes.string.isRequired,
		cuisines: React.PropTypes.array,
		carbs: React.PropTypes.string,
		calories: React.PropTypes.number,
		fat: React.PropTypes.string,
		protein: React.PropTypes.string,
		readyTime: React.PropTypes.number,
		costPerServing: React.PropTypes.number,
		image: React.PropTypes.string,
		usedIngredients: React.PropTypes.array,
		missedIngredients: React.PropTypes.array,
		missedIngredientsCost: React.PropTypes.number,
		//showIngredients: React.PropTypes.bool,
		//showNutrition: React.PropTypes.bool,
		//recommended: React.PropTypes.bool,
		//favorite: React.PropTypes.bool,
		//toggleFavorite: React.PropTypes.func,
		//addRecipe: React.PropTypes.func,
	};

	state = {
		dialogOpen: false,
		//addRecipeFlag:false,
	};

	constructor(props) {
		super(props);
	}

	toggleDialog = (e) => {
		this.setState({dialogOpen: !this.state.dialogOpen});
	};
	addToggle = (e) => {
		this.setState({addRecipeFlag: !this.state.addRecipeFlag});
		this.props.addRecipe.bind(null, e)
	}

	render() {
		const link = (
			<a
				href={`/recipe/${this.props.id}`}
				style={styles.link}
				title="View cooking steps"
			>
				{this.props.title.capitalize()}
			</a>
		);
		const actions = [
			<FlatButton
				label="Close"
				primary={true}
				onTouchTap={this.toggleDialog}
			/>
		];
		return (
			<Card
				className="recipe-summary"
				id={"recipe-summary-" + this.props.id}
				style={styles.card}
				zDepth={1}
			>
				<CardTitle
					title={link}
					titleStyle={styles.title}
				/>
				<CardMedia
					overlay={
						<span style={styles.overlayTitle}>
							{`Ready in ${this.props.readyTime} minutes`}
						</span>
					}
					onClick={this.toggleDialog}
					style={styles.media}
				>
					<div
						className="recipe-picture"
						style={{backgroundImage: `url(${this.props.image})`, height: 100}}
					>
						<style>{
							`#recipe-summary-${this.props.id}:hover .recipe-picture {
								background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 50%),
												  url(${this.props.image}) !important;
							}`
						}</style>
						
					</div>
					<Dialog
						actions={actions}
						autoScrollBodyContent={true}
						contentStyle={styles.dialogContent}
						modal={false}
						open={this.state.dialogOpen}
						onRequestClose={this.toggleDialog}
						style={styles.dialog}
						title={this.props.title.capitalize()}
					>
						<Grid style={{width: '100%'}}>
							<Row>
								<Col xs={12} sm={12} md={12} lg={12}>
									<div
										className="recipe-picture"
										style={{backgroundImage: `url(${this.props.image})`, height: 200}} />
								</Col>
							</Row>
						</Grid>
					</Dialog>
				</CardMedia>
				{this.renderActions()}
			</Card>
		);
	}

	renderActions() {
		let actions = {
			borderRadius: '0 0 2px 2px',
			padding: 3,
		};
		if (this.props.recommended === true) {
			actions.backgroundColor = '#2ca22c'; 
			actions.color = 'white';
		} else if (this.props.recommended === false) {
			actions.backgroundColor = red600; 
			actions.color = 'white';
		}
		return (
			<CardActions style={actions}>
				{this.renderNutritionInfo()}
			</CardActions>
		);
	}

	renderNutritionInfo() {
		if (this.props.showNutrition)
			return (
				<ul className="hlist">
					<li>
						<span>Carbs</span> {this.props.carbs}
					</li>
					<li>
						<span>Calories</span> {this.props.calories}
					</li>
					<li>
						<span>Fat</span> {this.props.fat}
					</li>
					<li>
						<span>Protein</span> {this.props.protein}
					</li>
				</ul>
			);
	}

	/*renderIngredients(list, heading) {
		if (this.props.showIngredients)
			return (
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Items title={heading}>
							{list.map((ingredient) => (
								<Ingredient
									key={ingredient.id}
									name={ingredient.name.capitalize()}
									quantity={ingredient.amount}
									unit={ingredient.unit}
									image={ingredient.image}
								/>
							))}
						</Items>
					</Col>
				</Row>
			);
	}*/
}

export default MealRecipe;

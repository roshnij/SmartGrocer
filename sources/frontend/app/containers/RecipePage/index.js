/*
 *
 * Recipe
 *
 */

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardTitle, CardMedia, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {
	Step,
	Stepper,
	StepLabel,
	StepContent,
} from 'material-ui/Stepper';
import FaIconPack from 'react-icons/lib/fa'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Equipment from '../../components/Equipment';
import Ingredient from '../../components/Ingredient';
import Items from '../../components/Items';
import AvAdd from 'material-ui/svg-icons/av/playlist-add';
import ActionRecord from 'material-ui/svg-icons/action/record-voice-over';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionLater from 'material-ui/svg-icons/action/watch-later';
import FaList  from 'react-icons/lib/fa/list'
import ImageTimer from 'material-ui/svg-icons/image/timer';
import {red600} from 'material-ui/styles/colors';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import axios from 'axios';
import ReactModal from 'react-modal';
import Modal from '../../components/Modal';

const styles = {
	actions: {
		textAlign: 'center',
	},
	card: {
		margin: '20px auto',
	},
	content: {
		boxSizing: 'border-box',
		display: 'block',
		margin: '20px auto',
		padding: 20,
		minHeight: 100,
		width: '100%',
	},
	icon: {
		height: 20,
		margin: '-2px 3px 0 3px',
		width: 20,
	},
	title: {
		boxOrient: 'vertical',
		fontSize: 24,
		fontWeight: 'normal',
		lineHeight: '25px',
		overflow: 'hidden',
		textAlign: 'center',
	},
	subtitle: {
		textAlign: 'center',
	},
};

export default class Recipe extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	state = {
		finished: false,
		loading: true,
		recipe: {},
		stepIndex: 0,
		isOpen: false,
	};

	constructor(props) {
		super(props);
		//var url = "http://localhost:8020/SmartGrocer/cookingsteps?id=${this.props.params.id}"
		//axios.get(`http://localhost:8020/SmartGrocer/cookingsteps?id=${this.props.params.id}`)
		//	.then(response => {
		//		this.setState({
		//			recipe: response.data.data[0],
		//			loading: false
		//		});
		//	});
		
		this.state.recipe = require('./recipe.json').data[0];

	}

	handleNext = () => {
		const { stepIndex } = this.state;
		this.setState({
			stepIndex: stepIndex + 1,
			finished: stepIndex >= this.state.recipe.cookingInstructions.length,
		});
	};

	handlePrev = () => {
		const { stepIndex } = this.state;
		if (stepIndex > 0) {
			this.setState({stepIndex: stepIndex - 1});
		}
	};

	toggleModal = () => {
		alert(this.state.isOpen);
		this.setState({
		  isOpen: !this.state.isOpen
		});
	}

	renderStepActions(step) {
		const { stepIndex } = this.state;
		const next = stepIndex < this.state.recipe.cookingInstructions.length - 1;
		return (
			<div style={{margin: '12px 0'}}>
				{next && (
					<RaisedButton
						label={'Next'}
						disableTouchRipple={true}
						disableFocusRipple={true}
						primary={true}
						onTouchTap={this.handleNext}
						style={{marginRight: 12}}
					/>
				)}
				{step > 0 && (
					<FlatButton
						label="Back"
						disabled={stepIndex === 0}
						disableTouchRipple={true}
						disableFocusRipple={true}
						onTouchTap={this.handlePrev}
					/>
				)}
			</div>
		);
	}

	renderIngredients(heading, list) {
		return (
			<Items title={heading}>
				{list.map(elem =>
					<Ingredient
						key={elem.id}
						name={elem.name.capitalize()}
						quantity={elem.amount}
						unit={elem.unit}
						image={elem.image}
					/>
				)}
			</Items>
		);
	}

	renderEquipment(heading, list) {
		return (
			<Items title={heading}>
				{list.map(elem =>
					<Equipment
						key={elem.id}
						name={elem.name.capitalize()}
						image={elem.image}
					/>
				)}
			</Items>
		);
	}

	renderRecipeInfo() {
		return (
			<CardText>
				<ul className="hlist">
					<li>
						<span>Carbs</span>
						{this.state.recipe.carbs}
					</li>
					<li>
						<span>Calories</span>
						{this.state.recipe.calories}
					</li>
					<li>
						<span>Fat</span>
						{this.state.recipe.fat}
					</li>
					<li>
						<span>Protein</span>
						{this.state.recipe.protein}
					</li>
					<li>
						<span>Preparation</span>
						<ImageTimer color="#aaa" style={styles.icon} />
						{this.state.recipe.readyInMinutes}min
					</li>
				</ul>
			</CardText>
		);
	}

	render() {
		console.log("render");
		/*if (this.state.loading)
			return this.renderContent(
				<Paper style={styles.content} zDepth={1}>
					<p>LOADING...</p>
				</Paper>
			);*/ // for hard-coded recipe, once recipe comes randomly remove comments
		const {finished, stepIndex} = this.state;
		return this.renderContent(
			<div>
				<Card
					initiallyExpanded={true}
					style={styles.card}
					zDepth={1}
				>
					<CardTitle
						actAsExpander={true}
						title={this.state.recipe.title.capitalize()}
						showExpandableButton={true}
						subtitle={this.state.recipe.cuisines.map(c => c.capitalize()).join(", ")}
						subtitleStyle={styles.subtitle}
						titleStyle={styles.title}
					/>
					<CardMedia expandable={true}>
						<div
							className="recipe-picture"
							style={{backgroundImage: `url(${this.state.recipe.image})`, height: 300}}
						/>
					</CardMedia>
					{this.renderRecipeInfo()}
					<CardActions style={styles.actions}>
						<FlatButton label="Add to Favorites" icon={<ActionFavorite />} primary={true} />
						<FlatButton label="I cooked this recipe" icon={<AvAdd />} />
						<FlatButton label="Recommend to a friend" icon={<ActionRecord />} />
						<FlatButton label="Save for later" icon={<ActionLater />} />
						<FlatButton label="List Missed Ingredients" icon={<FaList />} onTouchTap={this.toggleModal} />
					</CardActions>
				</Card>
				<Paper style={styles.content} zDepth={1}>
					<Stepper activeStep={stepIndex} orientation="vertical">
						{this.state.recipe.cookingInstructions.map((step) =>
							<Step key={step.number}>
								<StepLabel>Step {step.number}</StepLabel>
								<StepContent>
									{this.renderEquipment("Equipment", step.equipment)}
									{this.renderIngredients("Ingredients", step.ingredients)}
									<p>{step.step}</p>
									{this.renderStepActions(step.number - 1)}
								</StepContent>
							</Step>
						)}
					</Stepper>
				</Paper>
				<Modal show={this.state.isOpen}
					onClose={this.toggleModal}
					missedIngredients={this.state.recipe.missedIngredients}>
					Here's some content for the modal
				</Modal>
			</div>
		);
	}
	
	renderContent(children) {
		return (
			<Grid style={styles.root}>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						{children}
					</Col>
				</Row>
			</Grid>
		);
	}
}

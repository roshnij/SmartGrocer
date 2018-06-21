/*
 *
 * FavoritesPage
 *
 */

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import MealRecipe from '../../components/MealRecipe';
import FlatButton from 'material-ui/FlatButton';
import 'react-confirm-alert/src/react-confirm-alert.css'
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import DatePicker from 'material-ui/DatePicker';
import axios from 'axios';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
  } from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';
import IconButton from 'material-ui/IconButton';
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';
const styles = {
	content: {
		boxSizing: 'border-box',
		display: 'block',
		margin: '20px auto',
		padding: 20,
		minHeight: 100,
		width: '100%',
	},
	mealplan: {
		border: '1px solid black',
		//tableLayout: 'auto',
	},
	dateStyle: {
		palette :'red500',
	}
};

export class MealPlanPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		height: 'auto',
		fixedHeader: true,
		fixedFooter: true,
		stripedRows: false,
		showRowHover: false,
		selectable: true,
		multiSelectable: false,
		enableSelectAll: false,
		deselectOnClickaway: true,
		showCheckboxes: false,
		isOpen: false,
		toDate: Date.now(),
		endDate: Date.now(),
		recipesLunch: [],
		recipesDinner: [],
		recipesBreakFast: [],
		mealPlanHeading : '',
		weekDays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		eachDayCost: [],
		eachDayDiscountCost:[]
	}
	constructor(props) {
		//console.log(this.state.foodType);
		super(props);
		//var url = "http://localhost:8020/SmartGrocer/recipelist?type="+this.props.foodType+"&number=10&cuisine="+this.props.cuisine 
		//axios.get(url)
		//	.then(response => {
		//		this.setState({recipes: response.data.data});
		//	});
		const recipesBreakFast = require('./recipes_breakfast.json').data.map(elem => {
		 return elem;
		});
		this.state.recipesBreakFast = recipesBreakFast;
		const recipesLunch = require('./recipes_lunch.json').data.map(elem => {
			return elem;
		  });
		  this.state.recipesLunch = recipesLunch;
		  const recipesDinner = require('./recipes_dinner.json').data.map(elem => {
			return elem;
		  });
		  this.state.recipesDinner = recipesDinner;
	}
	handleStartDateChange = (event, date) => {
		this.setState({
		toDate: date,
	  });
	};
	handleEndDateChange = (event, date) => {
		this.setState({
		endDate: date,
	  });
	};
	showConfirm = () => {
		this.setState({
		  isOpen: !this.state.isOpen
		});
	}

	createMealPlan = () => {
		var sd = new Date(this.state.toDate);
		var ed = new Date(this.state.endDate);
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var cntr  = 7;
		var mealdaySchedule = [];
		var startIndex =  sd.getDay();
		var initialIndex = 0;
		while(cntr>0){
			if(startIndex<=days.length -1){
				mealdaySchedule.push(days[startIndex]);
				startIndex++;
			}
			else{
				mealdaySchedule.push(days[initialIndex]);
				initialIndex++;
			}
			cntr--;
		}
		var diff = Math.floor((Date.UTC(ed.getFullYear(), ed.getMonth(), ed.getDate()) - Date.UTC(sd.getFullYear(), sd.getMonth(), sd.getDate()) ) /(1000 * 60 * 60 * 24));
		var url = "http://localhost:8030/SmartGrocer/mealPlan?days="+diff;
		axios.get(url)
			.then(response => {
				this.setState({recipesBreakFast: response.data.data.breakfastRecipes, recipesLunch: response.data.data.lunchRecipes, recipesDinner: response.data.data.dinnerRecipes, weekDays:mealdaySchedule});
		});
		var sum = 0.0;
		var discountSum = 0.0
		this.state.eachDayDiscountCost = [];
		this.state.eachDayCost = [];
		for(var i=0; i <this.state.recipesLunch.length;i++){
			if(this.state.recipesLunch[i].missedIngredientsCost){
				sum =  this.state.recipesBreakFast[i].missedIngredientsCost + this.state.recipesLunch[i].missedIngredientsCost + this.state.recipesDinner[i].missedIngredientsCost;
				discountSum =  this.state.recipesBreakFast[i].missedIngredientsCostAfterDiscount+this.state.recipesLunch[i].missedIngredientsCostAfterDiscount + this.state.recipesDinner[i].missedIngredientsCostAfterDiscount;
				this.state.eachDayCost.push(sum);
				this.state.eachDayDiscountCost.push(discountSum);
			}
			else{
				sum  = 0.0 ;
				discountSum = 0.0;
				this.state.eachDayCost.push(sum);
				this.state.eachDayDiscountCost.push(discountSum);
			}
		}
	}
	floorFigure = (figure, decimals) => {
		if (!decimals) decimals = 2;
		var d = Math.pow(10,decimals);
		return (parseInt(figure*d)/d).toFixed(decimals);
	};
	render() {
		return (
			<Grid style={styles.root}>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Paper style={styles.content}>
							<Subheader>
								<Row>
									<Col>
										Start Date: 
										<DatePicker
											hintText="Meal Plan start date"
											value={this.state.toDate}
											onChange={this.handleStartDateChange}
											container="inline"
											dialogContainerStyle={styles.dateStyle}
										/>
									</Col>
									<Col style={{paddingLeft:'20px'}}>

										End Date: 
										<DatePicker
											hintText="Meal Plan end date"
											value={this.state.endDate}
											onChange={this.handleEndDateChange}
											container="inline"
											dialogContainerStyle={styles.dateStyle}
										/>
									</Col>
									<Col style={{paddingLeft:'20px', paddingTop: '40px'}}>
									<FlatButton  style={{backgroundColor: 'red'}} label="Create Meal Plan" onTouchTap={this.createMealPlan}/>
									</Col>
								</Row>
							</Subheader>
						
						</Paper>
						<Paper style={styles.content}>
							<Toolbar> 
								<ToolbarGroup>
								<FlatButton style={{left:'-25px',textAlign: 'left'}}icon={<FaAngleLeft style={{fontWeight:'bold',fontSize:'28px'}}/>} />
								</ToolbarGroup>
								<ToolbarGroup style={{textAlign:'left',fontWeight:'bold',fontSize:'18px'}}> Meal Plan: {(new Date(this.state.toDate)).toISOString().substring(0, 10)} - {(new Date(this.state.endDate)).toISOString().substring(0, 10)}
								</ToolbarGroup>
								<ToolbarGroup>
								<FlatButton style={{right:'-25px',textAlign: 'right'}}icon={<FaAngleRight style={{fontWeight:'bold',fontSize:'28px'}}/>} />
								</ToolbarGroup>
							</Toolbar>
							<Table
							height={this.state.height}
							fixedHeader={this.state.fixedHeader}
							fixedFooter={this.state.fixedFooter}
							selectable={this.state.selectable}
							multiSelectable={this.state.multiSelectable}
							style = {styles.mealplan} >
								<TableHeader
								displaySelectAll={this.state.showCheckboxes}
								adjustForCheckbox={this.state.showCheckboxes}>
								<TableRow>
									<TableHeaderColumn style={{color:'black',fontWeight: "bold", border: 'none', width: '5%'}} ></TableHeaderColumn>
									{this.state.weekDays.map((elem) =>
										<TableHeaderColumn style={{color:'black',fontWeight: "bold", border: '1px solid gray'}}>{elem}</TableHeaderColumn>
									)}
								</TableRow>
								</TableHeader>
								<TableBody
									displayRowCheckbox={this.state.showCheckboxes}>
									<TableRow>
									<TableRowColumn style={{fontSize: '13',verticalAlign:'left', paddingLeft:'0px', paddingRight:'0px', transform: `rotate(90deg)`, width: '5%', textOverflow: 'none'}}>Breakfast</TableRowColumn>
									{this.state.recipesBreakFast.map((elem,i) =>
										
										<TableRowColumn style={{color:'black',fontWeight: "bold", border: '1px solid gray'}}>
										{elem.id ? (
										<MealRecipe 
										key={elem.id}
										id={elem.id}
										title={elem.title}
										cuisines={elem.cuisines}
										carbs={elem.carbs}
										calories={elem.calories}
										fat={elem.fat}
										protein={elem.protein}
										readyTime={elem.readyInMinutes}
										costPerServing={elem.costPerServing}
										image={elem.image}
										usedIngredients={elem.usedIngredients}
										missedIngredients={elem.missedIngredients}
										missedIngredientsCost={elem.missedIngredientsCost}	
									/>
										):<FlatButton icon={<FaPlusCircle style={{color:'grey',fontSize:'38px'}}/>} />}
									</TableRowColumn>	
									
									)}
									</TableRow>
									<TableRow >
									<TableRowColumn style={{fontSize: '13',verticalAlign:'middle', margin:'0px', paddingLeft:'0px', paddingRight:'0px', transform: `rotate(90deg)`, width: '5%'}}>Lunch</TableRowColumn>
									{this.state.recipesLunch.map((elem,i) =>
										
										<TableRowColumn style={{color:'black',fontWeight: "bold", border: '1px solid gray'}}>
										{elem.id ? (
										<MealRecipe 
										key={elem.id}
										id={elem.id}
										title={elem.title}
										cuisines={elem.cuisines}
										carbs={elem.carbs}
										calories={elem.calories}
										fat={elem.fat}
										protein={elem.protein}
										readyTime={elem.readyInMinutes}
										costPerServing={elem.costPerServing}
										image={elem.image}
										usedIngredients={elem.usedIngredients}
										missedIngredients={elem.missedIngredients}
										missedIngredientsCost={elem.missedIngredientsCost}	
										/>
										):<FlatButton icon={<FaPlusCircle style={{color:'grey',fontSize:'38px'}}/>} />}
									</TableRowColumn>	
									
									)}
									</TableRow>
									<TableRow>
									<TableRowColumn style={{fontSize: '13',verticalAlign:'middle', margin:'0px', paddingLeft:'0px', paddingRight:'0px', transform: `rotate(90deg)`, width: '5%'}}>Dinner</TableRowColumn>
									{this.state.recipesDinner.map((elem,i) =>
										
										<TableRowColumn style={{color:'black',fontWeight: "bold", border: '1px solid gray'}}>
										{elem.id ? (
										<MealRecipe 
										key={elem.id}
										id={elem.id}
										title={elem.title}
										cuisines={elem.cuisines}
										carbs={elem.carbs}
										calories={elem.calories}
										fat={elem.fat}
										protein={elem.protein}
										readyTime={elem.readyInMinutes}
										costPerServing={elem.costPerServing}
										image={elem.image}
										usedIngredients={elem.usedIngredients}
										missedIngredients={elem.missedIngredients}
										missedIngredientsCost={elem.missedIngredientsCost}	
										/>
										):<FlatButton icon={<FaPlusCircle style={{color:'grey',fontSize:'38px'}}/>} />}
									</TableRowColumn>	
									
									)}
									</TableRow>
									<TableRow style={{height:'200px'}}>
									<TableRowColumn style={{fontSize: '13',position: 'absolute',left:'150px', bottom:'-255px', margin:'0px', paddingLeft:'0px', paddingRight:'0px', transform: `rotate(90deg)`, width: '5%'}}>Summary</TableRowColumn>
									{this.state.eachDayCost.map((elem,i) =>
										<TableRowColumn style={{color:'black',whiteSpace: 'normal',wordWrap: 'break-word', border: '1px solid gray'}}>
											<b>Ori. Cost</b>: {this.floorFigure(elem)}<br/>
											<b>Discounted Cost</b>: {this.floorFigure(this.state.eachDayDiscountCost[i])}<br/>
											<b>Savings</b>: {this.floorFigure(this.floorFigure(elem) - this.floorFigure(this.state.eachDayDiscountCost[i]))}<br/>
											{this.floorFigure(elem)>0?<a href="www.google.com">Nutrient Details</a>:''}
										</TableRowColumn>
									)}
									</TableRow>
								</TableBody>
							</Table>
							<Toolbar> 
								<ToolbarGroup>
								<FlatButton  style={{backgroundColor: 'red',textAlign:'right',right:'-1000px'}} label="Finalize" onTouchTap={this.showConfirm}/>
								</ToolbarGroup>
							</Toolbar>
						</Paper>
						{this.state.isOpen ? (
								<ReactConfirmAlert
								title="Meal Plan created!Created a Grocery List for all the missed ingredients."
								confirmLabel="Ok"
								onConfirm={() => this.setState({isOpen:!this.state.isOpen})}
								style = {{width:'100%',fontSize:'12px'}}/>
						):this.state.isOpen =false}
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default MealPlanPage;

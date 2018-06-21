import React, { Component } from 'react';
import PubSub from 'pubsub-js';  
import request from 'then-request'; 
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import {
	Step,
	Stepper,
	StepLabel,
	StepContent,
} from 'material-ui/Stepper';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
  } from 'material-ui/Table';
  import FaClose from 'react-icons/lib/fa/close';
  import FaPlusCircle from 'react-icons/lib/fa/plus-circle';
  import FlatButton from 'material-ui/FlatButton';
  import SelectField from 'material-ui/SelectField';
  import MenuItem from 'material-ui/MenuItem';
  import TextField from 'material-ui/TextField';
  import Divider from 'material-ui/Divider';
  import HomePage from '../../containers/HomePage';
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
	customWidth: {
		width: 150,
	},
	root: {
		position: 'relative',
		width: '100%',
	},
}; 
class ShoppingList extends React.PureComponent {
	state = {
		groceryCollection: [],
		fixedHeader: true,
		fixedFooter: true,
		stripedRows: false,
		showRowHover: false,
		selectable: true,
		multiSelectable: false,
		enableSelectAll: false,
		deselectOnClickaway: true,
		showCheckboxes: false,
		height: 'auto',
		counter:0,
		value: 1,
		walmartGroceryItems:{},
		filteredGrocery: [],
		newItem: '',
		totalGroceryCost: 0.0,
	};
	/*static propTypes = {
		missedIngredientsListFinal: React.PropTypes.any,
	};*/
	/*static propTypes = {
		missedIngredientsList: React.PropTypes.any,
	};*/
    constructor(props){
		super(props);
		
		//need to add from database
		//console.log("items123:" + JSON.stringify(this.props.missedIngredientsList));
        /*this.state.groceryCollection = ["sweet potato","lettuce", "salsa","hot sauce","juice of lime","jalapeno","avocado","swerve sweetener","black beans"];
		
		//this.state.groceryCollection = require('./grocList.txt');
		this.state.walmartGroceryItems = require('./Walmart_grocery_Product.json').data[0];
		console.log(this.state.walmartGroceryItems['groceryProducts'].length);
		for(var j=0;j<this.state.groceryCollection.length;j++){
			for(var i=0; i<this.state.walmartGroceryItems['groceryProducts'].length; i++){
				console.log("item:" + JSON.stringify(this.state.walmartGroceryItems['groceryProducts'][i]));
				if(this.state.groceryCollection[j] === this.state.walmartGroceryItems['groceryProducts'][i].name){
					this.state.filteredGrocery.push(this.state.walmartGroceryItems['groceryProducts'][i]);
					this.state.totalGroceryCost += this.state.walmartGroceryItems['groceryProducts'][i].price;
					break;
				}
				
			}
		}*/
		this.state.groceryCollection = require('./grocList_v2.json').data;
		this.state.walmartGroceryItems = require('./Walmart_grocery_Product.json').data[0];
		var ratio = 1;
		//console.log("length1: " + this.state.groceryCollection.length);
		console.log("length2: " + this.state.walmartGroceryItems['groceryProducts'].length);
		for(var j=0;j<this.state.groceryCollection.length;j++){
			for(var i=0; i<this.state.walmartGroceryItems['groceryProducts'].length; i++){
				if(this.state.groceryCollection[j].name === this.state.walmartGroceryItems['groceryProducts'][i].name){
					
					ratio = Math.round(this.state.groceryCollection[j].amount * this.state.walmartGroceryItems['groceryProducts'][i].price*100)/100;
					this.state.walmartGroceryItems['groceryProducts'][i].price = ratio;
					ratio = Math.round(this.state.groceryCollection[j].amount * this.state.walmartGroceryItems['groceryProducts'][i].amount*100)/100;
					this.state.walmartGroceryItems['groceryProducts'][i].amount = ratio;
					if(this.state.groceryCollection[j].unit === ''){
						this.state.walmartGroceryItems['groceryProducts'][i].unit = "piece";
					}
					this.state.filteredGrocery.push(this.state.walmartGroceryItems['groceryProducts'][i]);
					this.state.totalGroceryCost += this.state.walmartGroceryItems['groceryProducts'][i].price;
					this.state.totalGroceryCost = Math.round(this.state.totalGroceryCost*100)/100;
					break;
				}
			}
		}
		console.log("items:" + this.state.filteredGrocery);
		

	}
	/*componentWillReceiveProps(nextProps){
		console.log("miss ing from home: " + JSON.stringify(nextProps.missedIngredientsList));
	}*/
	deleteRow = (e) => {
		// how to I get which item was clicked???
		console.log(e);
		var modifiedArr =  [...this.state.filteredGrocery];
		var modifiedGroceryCollection = [...this.state.groceryCollection];
		modifiedArr.splice(e,1);
		modifiedGroceryCollection.splice(e,1)
		console.log(modifiedArr);
		this.state.totalGroceryCost =0;
		for(var k =0; k< modifiedArr.length;k++){
			this.state.totalGroceryCost += modifiedArr[k].price;
		}
		this.state.totalGroceryCost = Math.round(this.state.totalGroceryCost*100)/100;
		this.setState({filteredGrocery: modifiedArr, groceryCollection:modifiedGroceryCollection})
	}
	addRecommendedItem = (e,discountPrice) => {
		console.log(e,discountPrice);
		var groc_names_array =[];
		var newitem ={};
		for(var k=0;k<this.state.groceryCollection.length;k++){
			groc_names_array.push(this.state.groceryCollection[k].name);
		}
		if(groc_names_array.indexOf(e) === -1){
			newitem["name"] = e;
			newitem["price"] = "";
			newitem["amount"] = 1;
			newitem["unit"] ="";
			this.state.groceryCollection.push(newitem);
		}
		console.log("upated lst: " + JSON.stringify(this.state.groceryCollection));
		var newFilteredGrocery =[];
		this.state.totalGroceryCost = 0.0
		for(var j=0;j<this.state.groceryCollection.length;j++){
			for(var i=0; i<this.state.walmartGroceryItems['groceryProducts'].length; i++){
				if(this.state.groceryCollection[j].name === this.state.walmartGroceryItems['groceryProducts'][i].name){
					if(this.state.walmartGroceryItems['groceryProducts'][i].name === e){
						this.state.walmartGroceryItems['groceryProducts'][i].discount = discountPrice/100;
						this.state.totalGroceryCost -= discountPrice/100;
					}
					newFilteredGrocery.push(this.state.walmartGroceryItems['groceryProducts'][i]);
					this.state.totalGroceryCost += this.state.walmartGroceryItems['groceryProducts'][i].price;
					break;
				}
				
			}
		}
		this.state.totalGroceryCost = Math.round(this.state.totalGroceryCost*100)/100;
		this.setState({filteredGrocery:newFilteredGrocery});
	}
	handleChange = (event, index, value) => {console.log(index,value); 
		this.setState({value});
	}
	handleNewItem = (event, newValue) =>{
		console.log(newValue);
		this.setState({newItem:newValue});
	}
	addNewItem = () => {
		this.state.groceryCollection.push(this.state.newItem);
		console.log("new item list: " + this. state.groceryCollection);
		var newFilteredGrocery =[];
		this.state.totalGroceryCost = 0.0
		for(var j=0;j<this.state.groceryCollection.length;j++){
			for(var i=0; i<this.state.walmartGroceryItems['groceryProducts'].length; i++){
				if(this.state.groceryCollection[j] === this.state.walmartGroceryItems['groceryProducts'][i].name){
					newFilteredGrocery.push(this.state.walmartGroceryItems['groceryProducts'][i]);
					this.state.totalGroceryCost += this.state.walmartGroceryItems['groceryProducts'][i].price;
					break;
				}
				
			}
		}
		this.state.totalGroceryCost = Math.round(this.state.totalGroceryCost*100)/100;
		console.log("new length:" + this.state.filteredGrocery.length);
		this.setState({filteredGrocery:newFilteredGrocery});
	}
	
	render() {
		console.log("render");
		
		//console.log("list: " + JSON.stringify(this.props.missedIngredientsListFinal));
		console.log(this.state.filteredGrocery);
            return (
                <Grid style={styles.root}>
					<Paper style={styles.content}>
						<Row>
				
							<Col xs={12} sm={12} md={12} lg={12}>
						
								<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={this.state.selectable}
								multiSelectable={this.state.multiSelectable} >
									<TableHeader
									displaySelectAll={this.state.showCheckboxes}
									adjustForCheckbox={this.state.showCheckboxes}>
									<TableRow>
										<TableHeaderColumn colSpan="2" style={{textAlign: 'left', backgroundColor:'#EF9A9A',color:'black',fontSize:'16px',fontWeight: "bold"}}>
											Shopping List
										</TableHeaderColumn>
										<TableHeaderColumn colSpan="3" style={{textAlign: 'left', backgroundColor:'#EF9A9A',color:'black',fontSize:'16px'}}>
										<Paper style={styles.root} zDepth={1}><TextField hintText="Add New Item" onChange ={this.handleNewItem} style = {{underlineFocusStyle:'none',backgroundColor:'white',height:'40px',paddingLeft :'5px', width:'90%'}} />
											<FlatButton icon={<FaPlusCircle onTouchTap={this.addNewItem}/>} style={{textAlign: 'left', paddingRight:'10px', width:20}}/></Paper>	
										</TableHeaderColumn>
										
									</TableRow>
										<TableRow>
											<TableHeaderColumn style={{color:'black',fontWeight: "bold"}}>Product/Item</TableHeaderColumn>
											<TableHeaderColumn style={{color:'black',fontWeight: "bold"}}>Unit</TableHeaderColumn>
											<TableHeaderColumn style={{color:'black',fontWeight: "bold"}}>Quantity</TableHeaderColumn>
											<TableHeaderColumn style={{color:'black',fontWeight: "bold"}}>Price($)</TableHeaderColumn>
											<TableHeaderColumn></TableHeaderColumn>
										</TableRow>
									</TableHeader>
									<TableBody
									displayRowCheckbox={this.state.showCheckboxes}>
										{this.state.filteredGrocery.map((item,i) =>
											
											<TableRow key = {item.name}>
												<TableRowColumn>{item.name}</TableRowColumn>
												<TableRowColumn>{item.unit}</TableRowColumn>
												<TableRowColumn>{item.amount}</TableRowColumn>
												<TableRowColumn><b style={item.discount!==0?{color:'black', textDecorationLine : 'line-through'}:{color:'black'}}>{item.price.toString()}</b><b style={{color:'red',fontWeight: "bold", isStrikeThrough: false}}>{item.discount===0?'':'/'+(item.price-item.discount).toString()}</b></TableRowColumn>
												<TableRowColumn><FlatButton  icon={<FaClose />}  onTouchTap={this.deleteRow.bind(this, i)} /></TableRowColumn>
											</TableRow>
										)}
										<TableRow>
										<TableRowColumn colSpan = '3' style={{fontWeight:'bold', textAlign: 'right'}}>Total:</TableRowColumn>
										<TableRowColumn colSpan = '2'style={{fontWeight:'bold', textAlign: 'left'}}>{this.state.totalGroceryCost}</TableRowColumn>
										</TableRow>
										<TableRow>
										<TableRowColumn colSpan="5" style={{textAlign: 'right'}}>
										<FlatButton  style={{backgroundColor: 'red'}} label="Proceed to Checkout" />
										</TableRowColumn>
										</TableRow>
									</TableBody>
								</Table>
							</Col>
						</Row>
						<Row style = {{paddingTop:'50px'}}>
							<Col>
								<Table
								height={this.state.height}
								fixedHeader={this.state.fixedHeader}
								fixedFooter={this.state.fixedFooter}
								selectable={this.state.selectable}
								multiSelectable={this.state.multiSelectable}>
								<TableHeader
									displaySelectAll={this.state.showCheckboxes}
									adjustForCheckbox={this.state.showCheckboxes}>
									<TableRow>
										<TableHeaderColumn  colSpan="5" style={{textAlign: 'left', backgroundColor:'#EF9A9A',color:'black',fontSize:'16px',fontWeight: "bold"}}>
										Grocery Item Recommendations For You
										</TableHeaderColumn>
									</TableRow>
								</TableHeader>
									<TableBody displayRowCheckbox={this.state.showCheckboxes}>
										<TableRow>
											<TableRowColumn>capsicum</TableRowColumn>
											<TableRowColumn>20% off</TableRowColumn>
											<TableRowColumn>
											<FlatButton label = "Add" onTouchTap={this.addRecommendedItem.bind(this,"capsicum",20)} style = {{backgroundColor:'grey'}}/>
											</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>onion</TableRowColumn>
											<TableRowColumn>10% off</TableRowColumn>
											<TableRowColumn>
											<FlatButton label = "Add" onTouchTap={this.addRecommendedItem.bind(this,"onion",10)} style = {{backgroundColor:'grey'}}/>
											</TableRowColumn>
										</TableRow>
										<TableRow>
											<TableRowColumn>caesar sauce</TableRowColumn>
											<TableRowColumn>15% off</TableRowColumn>
											<TableRowColumn>
											<FlatButton label = "Add" onTouchTap={this.addRecommendedItem.bind(this,"caesar sauce",15)} style = {{backgroundColor:'grey'}}/>
											</TableRowColumn>
										</TableRow>
									</TableBody>
								</Table>
						
					</Col>
					
				</Row>
				</Paper>
				
				
			</Grid>
			
            );
    
    }
}


export default ShoppingList;
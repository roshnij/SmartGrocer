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
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import MdLocalOffer from 'react-icons/lib/md/local-offer';
import MenuItem from 'material-ui/MenuItem';
import MdRemove from 'react-icons/lib/md/remove';
import axios from 'axios';	
import {Sticky} from 'react-sticky';
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
  import TextField from 'material-ui/TextField';
const styles = {
	content: {
		boxSizing: 'border-box',
		display: 'block',
		margin: '20px auto',
		padding: 20,
		minHeight: 100,
		width: '100%',
	},
	root: {
		width: '100%',
	},
};

export class GroceryList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
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
		ingredientsCoupons:[],
		groceryList:[],
		recommendedCoupons:[]
	};

	constructor(props) {
		console.log("hi");
		super(props);
		//var url = "http://localhost:8020/SmartGrocer/recipelist?type="+this.props.foodType+"&number=10&cuisine="+this.props.cuisine 
		//axios.get(url)
		//	.then(response => {
		//		this.setState({recipes: response.data.data});
		//	});
		const groc = require('./groc_Lindsay.json').data.map(elem => {
		  return elem;
		});
		this.state.ingredientsCoupons = groc;
		for (var key in this.state.ingredientsCoupons[0]){
			if(key == "RecommendedCoupons"){
				this.state.recommendedCoupons = this.state.ingredientsCoupons[0][key];
			}
			else{
				var ingrObj ={};
				ingrObj["name"] = key;
				if(this.state.ingredientsCoupons[0][key].discount>0){
					ingrObj["discount"]=this.state.ingredientsCoupons[0][key].discount;
						
				}
				ingrObj["recipes"]=this.state.ingredientsCoupons[0][key].recipes;
				this.state.groceryList.push(ingrObj);
			}
		}
		console.log(this.state.groceryList);
		
		
	}
	
	render() {
		return (
			<Grid style={styles.root}>
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<Paper style={styles.content}>
							<List style={{paddingLeft :'20px', paddingTop :'5px', textAlign: 'left', backgroundColor:'#EF9A9A', fontSize:'26px',fontWeight: "bold", height: '50px'}}>
									Grocery List
									<Paper style={{width: '50%',boxSizing: 'border-box', margin: '-40px 300px'}} ><TextField hintText="Add New Item" style = {{underlineFocusStyle:'none',backgroundColor:'white',height:'40px',paddingLeft :'5px', width:'87%'}} />
											<FlatButton icon={<FaPlusCircle />} style={{textAlign: 'left', paddingRight:'10px', width:20}}/></Paper>
								
							</List>
							<List>
							{this.state.groceryList.map((elem, i) =>
								elem.discount ?(
									[<ListItem style={{height:'70px'}} leftIcon={<MdRemove  size={70} style={{transform: `rotate(90deg)`, color:'red', left: '-4px', margin: '-29px', top: '15px', height: '106px', width: '150px'}}/>}>{elem.name}<span style={{fontStyle:"italic", paddingLeft:"50px", color:'black', fontSize: '13px', whiteSpace:"nowrap"}}><b>Recipes:</b> {elem.recipes.join(", ")}</span>
									<br /> <p style={{color:'gray', fontSize: '14px'}}><MdLocalOffer/> {elem.discount}% off from U Stop Grocery Store </p>
									</ListItem>,<Divider/>]
									):([<ListItem style={{height:'70px'}} leftIcon={<MdRemove  size={50} style={{transform: `rotate(90deg)`, color:'red', left: '-4px', margin: '-29px', top: '15px', height: '106px', width: '150px'}}/>}>{elem.name}<span style={{fontStyle:"italic", paddingLeft:"50px", color:'black', fontSize: '13px', whiteSpace:"nowrap"}}><b>Recipes:</b> {elem.recipes.join(", ")}</span>
								</ListItem>,<Divider/>])
								
								
							)}
							</List>
								
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
										<TableHeaderColumn  colSpan="5" style={{textAlign: 'left', backgroundColor:'#EF9A9A',color:'black',fontSize:'26px',fontWeight: "bold"}}>
										Recommended Coupons
										</TableHeaderColumn>
									</TableRow>
								</TableHeader>
									<TableBody displayRowCheckbox={this.state.showCheckboxes}>
									{this.state.recommendedCoupons.map((elem, i) =>
										<TableRow>
											<TableRowColumn>{elem.name}</TableRowColumn>
											<TableRowColumn>{elem.discount}% off</TableRowColumn>
											<TableRowColumn>
											<FlatButton label = "Add" style = {{backgroundColor:'grey'}}/>
											</TableRowColumn>
										</TableRow>
									)}
									</TableBody>
								</Table>
						
						</Paper>
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default GroceryList;

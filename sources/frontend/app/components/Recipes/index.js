/**
*
* Recipes
*
*/

import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RecipeSummary from '../RecipeSummary';

const styles = {
	grid: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
	},
}

class Recipes extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

	static propTypes = {
		isRecommended: React.PropTypes.func,
		minCost: React.PropTypes.number,
		maxCost: React.PropTypes.number,
		recipes: React.PropTypes.array,
		showIngredients: React.PropTypes.bool,
		showNutrition: React.PropTypes.bool,
		showBudget: React.PropTypes.bool,
		sortBy: React.PropTypes.string,
		sortMode: React.PropTypes.string,
		toggleFavorite: React.PropTypes.func,
		addRecipe:  React.PropTypes.func,
	};

	render() {
		const recipes = this.filter(this.sort(this.props.recipes));
		return (
			<Grid style={styles.grid}>
				<Row>
					{recipes.map(elem => {
						return (
							<Col
								key={elem.id + "-col"}
								xs={12} sm={6} md={4} lg={3}>
								<RecipeSummary 
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
									missedIngredientsCostAfterDiscount={elem.missedIngredientsCostAfterDiscount}
									showIngredients={this.props.showIngredients}
									showNutrition={this.props.showNutrition}
									showBudget={this.props.showBudget}
									recommended={this.props.isRecommended()}
									favorite={elem.favorite}
									toggleFavorite={this.toggleFavorite}
									addRecipe={this.addRecipe}
								/>
							</Col>
						);
					})}
				</Row>
			</Grid>
		);
	}

	toggleFavorite = (child, e) => {
		this.props.toggleFavorite(child.props.id, !child.props.favorite);
	};

	addRecipe = (child, e) => {
		console.log(child);
		this.props.addRecipe(child.props.missedIngredients);
	};

	filter(recipes) {
		const min = this.props.minCost || 0;
		const max = this.props.maxCost || Number.MAX_SAFE_INTEGER;
		return recipes.filter(r => r.costPerServing >= min && r.costPerServing <= max);
	}

	sort(recipes) {
		let value;
		let sort = (elem1, elem2) => {
			let a = value(elem1), b = value(elem2);
			if (this.props.sortMode === "descending") {
				let tmp = a;
				a = b;
				b = tmp;
			}
			if (a - b < 0)
				return -1;
			else if (a - b > 0)
				return 1;
			return 0;
		};
		switch (this.props.sortBy) {
			case "costPerServing":
				value = (e) => e.costPerServing;
			break;
			case "readyTime":
				value = (e) => e.readyInMinutes;
			break;
			case "missedIngredients":
				value = (e) => e.missedIngredients.length;
			break;
			case "missedIngredientsCost":
				value = (e) => e.missedIngredientsCostAfterDiscount;
			break;
			default:
				sort = (a, b) => -1;
		}
		return recipes.sort(sort);
	}

}

export default Recipes;

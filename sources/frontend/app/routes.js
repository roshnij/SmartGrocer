// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
	console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
	cb(null, componentModule.default);
};

export default function createRoutes(store) {
	// Create reusable async injectors using getAsyncInjectors factory
	const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

	return [
		{
			path: '/',
			name: 'home',
			getComponent(nextState, cb) {
				const importModules = Promise.all([
					System.import('containers/HomePage'),
				]);
				const renderRoute = loadModule(cb);
				importModules.then(([component]) => {
					renderRoute(component);
				});
				importModules.catch(errorLoading);
			},
		},{
			path: '/recipe/:id',
			name: 'recipe',
			getComponent(location, cb) {
				System.import('containers/RecipePage')
					.then(loadModule(cb))
					.catch(errorLoading);
			},
		}, {
			path: '/favorites',
			name: 'favoritesPage',
			getComponent(location, cb) {
				System.import('containers/FavoritesPage')
					.then(loadModule(cb))
					.catch(errorLoading);
			},
		}, {
			path: '/analytics',
			name: 'analyticsPage',
			getComponent(location, cb) {
				System.import('containers/AnalyticsPage')
					.then(loadModule(cb))
					.catch(errorLoading);
			},
		}, {
			path: '/myprofile',
			name: 'profilePage',
			getComponent(location, cb) {
				System.import('containers/ProfilePage')
					.then(loadModule(cb))
					.catch(errorLoading);
			},
		}, {
			path: '/history',
			name: 'historyPage',
			getComponent(location, cb) {
				System.import('containers/HistoryPage')
					.then(loadModule(cb))
					.catch(errorLoading);
			},
		}, 
		{
			path: '/shoppinglist',
			name: 'shoppingList',
			getComponent(nextState, cb) {
				System.import('containers/ShoppingList')
				.then(loadModule(cb))
				.catch(errorLoading);
			},
		},	
		{
			path: '/mealplan',
			name: 'mealPlan',
			getComponent(nextState, cb) {
				System.import('containers/MealPlanPage')
				.then(loadModule(cb))
				.catch(errorLoading);
			},
		},
		{
			path: '/grocerylist',
			name: 'groceryList',
			getComponent(nextState, cb) {
				System.import('containers/GroceryList')
				.then(loadModule(cb))
				.catch(errorLoading);
			},
		},{
			path: '*',
			name: 'notfound',
			getComponent(nextState, cb) {
				System.import('containers/NotFoundPage')
				.then(loadModule(cb))
				.catch(errorLoading);
			},
		},
	];
}

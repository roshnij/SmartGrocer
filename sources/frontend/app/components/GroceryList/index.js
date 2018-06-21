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
class GroceryList extends React.PureComponent {
    static propTypes = {
        show: React.PropTypes.bool.isRequired,
    };
    
    constructor(props){
        super(props);
        this.state = {
          groceryCollection: [],
        }
    }
    
    componentWillMount(){
        // This is where we subscribe this class to the 'GET FILES' subscription.
        // once a publish event for 'GET FILES' has been fired, FileList.subscriber() will be triggered.
        this.token = PubSub.subscribe('GET Grocery', this.subscriber.bind(this));
    }
    componentDidMount(){
        PubSub.publish('GET Grocery', this.token);
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.token);
    }
    
    // The function that is subscribed to the publisher
    subscriber(msg, data){
        this.setState({
            groceryCollection: data
        }.bind(self));
    
    }
    
    render () {
        if(this.props.show){

            return (
                <div>
                    <Paper style={styles.content} zDepth={1}>
                        <Stepper orientation="auto">
                            {this.state.fileCollection.map((item) =>
                                <Step key={item}>
                                <StepLabel>{item}</StepLabel>
                                </Step>
                            )}
                        </Stepper>
                    </Paper>
                </div>
            );
        }
    }
}

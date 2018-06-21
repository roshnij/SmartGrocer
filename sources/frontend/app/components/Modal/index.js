import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import {red600} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import {
	Step,
	Stepper,
	StepLabel,
	StepContent,
} from 'material-ui/Stepper';
import ShoppingList from '../../containers/ShoppingList';
var fs = require('react-file-download');
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

const itemFile = '../groceryList.txt'  

class Modal extends React.PureComponent {
    
    static propTypes = {
        onClose: React.PropTypes.func.isRequired,
        show: React.PropTypes.bool,
        missedIngredients: React.PropTypes.any,
    };
    state = {
        stepIndex: 0,
        grocArr:[],
    };
    

    
    handleList = () => {
        console.log("in handleList");
        {this.props.missedIngredients.map((step) =>
            this.state.grocArr.push(step.name)
        )}
        fs(this.state.grocArr,'grocList.txt');
		
	};
  render() {
    const {stepIndex} = this.state;
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      //padding: 30
    };
    console.log("in modal")
    return (
        <div className="backdrop" style={backdropStyle} >
        <div className="modal" style={modalStyle} >
            <Paper style={styles.content} zDepth={1}>
                <Stepper orientation="auto">
                    {this.props.missedIngredients.map((step) =>
                        <Step key={step.id}>
                        <StepLabel>{step.name}</StepLabel>
                        </Step>
                    )}
                </Stepper>
			

          <div className="footer">
              <Row>
                  <Col>
                    <RaisedButton 
                        label = {'Close'}
                        disableTouchRipple={true}
						disableFocusRipple={true}
						primary={true} 
                        onTouchTap={this.props.onClose}
                        style={{marginRight: 12}}
                    />
                  </Col>
                  <Col>
                    <RaisedButton 
                        label = {'Add to Grocery List'}
                        disableTouchRipple={true}
						disableFocusRipple={true}
						primary={true} 
                        onTouchTap={this.handleList}
                        style={{marginRight: 12}}
                    />
                  </Col>
              </Row>
          </div>
          </Paper>
        </div>
      </div>
    );
  }
}



export default Modal;
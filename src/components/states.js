import React from 'react';
import Select from 'react-select';
import './states.css';

const STATES = require('../data/states');

var StatesField = React.createClass({
  displayName: 'StatesField',
  propTypes: {
    label: React.PropTypes.string,
  },
  getDefaultProps () {
    return {
      label: 'States:',
    };
  },
  getInitialState () {
    return {
      country: 'US',
      selectValue: '',
    };
  },
  updateValue (newValue) {
    console.log('State changed to ' + newValue);
    this.setState({
      selectValue: newValue
    });
  },
  render () {
    var options = STATES[this.state.country];
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>
        <Select ref="stateSelect" autofocus options={options} simpleValue name="selected-state" value={this.state.selectValue} onChange={this.updateValue} />
      </div>
    );
  }
});


module.exports = StatesField;

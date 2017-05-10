import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './App.css';

class App extends Component {
  var options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  function logChange(val) {
    console.log("Selected: " + val);
  }

  render() {
    return (
      <div className="container">
        <div className="left-container">
          <h1>Well Logged</h1>
          <h3 className="about-justified">The process is simple. Enter the 10 digit API number of the well your interested in, select the logs you want, and download. The logs will automagically download to your system. Eventually the data will be converted to txt files using machine learning principles. For now, enjoy the simplicity.</h3>
          <div className="api-form">
            <label for="api_search">API no.</label>
            <Select
              name="form-field-name"
              value="one"
              options={options}
              onChange={logChange}
            />
            <input id="api-form-input" type="text" name="api_search" placeholder="##-###-#####" />
            <button id="api-form-submit">Download</button>
          </div>
        </div>
        <div className="right-container">
          <img className="gusherWell" src={require('../images/OilWellGushing.gif')} alt="gushing oil well" />
        </div>
      </div>
    );
  }
}

export default App;

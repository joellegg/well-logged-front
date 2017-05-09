import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-container">
          <h1>Well Logged</h1>
          <h3 className="about-justified">The process is easy. Enter the 10 digit API number of the well your interested in, selected the logs you want, and press download. The logs will automagically download to your system. Eventually the data will be converted to txt files by using machine learning principles</h3>
          <div className="api-form">
            <label for="api_search">API no.</label>
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

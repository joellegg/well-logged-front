import React, { Component } from 'react'
import 'react-select/dist/react-select.css'
import './App.css';

import Logs from './components/Logs'
import Charts from './components/Charts'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="left-container">
          <h1 className="left-container-fancyFont">Well Logged</h1>
          <h3 className="about-justified">The process is simple. Enter the 10 digit API number of the well your interested in and select the logs you want. The logs will download to your system. Eventually the data will be converted to txt files using machine learning principles. For now, enjoy the simplicity.</h3>
          <div className="api-form">
            <Logs label="There will be logs" searchable />
          </div>
        </div>
        <div className="right-container">
          <Charts />
        </div>
      </div>
    )
  }
}

export default App;

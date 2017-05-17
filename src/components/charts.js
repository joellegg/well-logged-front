import React, {Component} from 'react'
import axios from 'axios';
const CO_countyCodes = require('../data/CO_countyCodes.js')

class Charts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      chartCount: true,
    }
    this.countDoc = this.countDoc.bind(this)
    this.countCounty = this.countCounty.bind(this)
  }

  componentDidMount() {
    console.log('data mounted', CO_countyCodes)
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { x:res.doc_type, y:res.count}
        })
        console.log('data', data)
        this.setState({ chartCount: true, data: data })
      })
      .catch(err => console.log(err));
  }

  countDoc() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { x:res.doc_type, y:res.count}
        })
        console.log('data', data)
        this.setState({ chartCount: true, data: data })
      })
      .catch(err => console.log(err));
  }

  countCounty() {
    console.log('count by county')
    return axios.get(`http://localhost:8080/v1/countCounties`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { x:res.startswith, y:res.count}
        })
        console.log('data', data)
        this.setState({ chartCount: false, data: data })
      })
      .catch(err => console.log(err));
  }

  render () {
    return (
      <div>
        <h1>Charts display below</h1>
        <label className="checkbox">
          <input type="radio" className="checkbox-control" checked={this.state.chartCount} onChange={this.countDoc}/>
          <span className="checkbox-label">log count by doc type</span>
          <input type="radio" className="checkbox-control" checked={!this.state.chartCount} onChange={this.countCounty}/>
          <span className="checkbox-label">log count by county</span>
        </label>
        <div>
          <h3>Available logs will display below</h3>
          {this.state.data.map(function(log) {
            return (
              <p key={log.x}>{log.x} {log.y}</p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Charts;

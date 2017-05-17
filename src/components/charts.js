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
    return axios.get(`http://localhost:8080/v1/countCounties`)
      .then((response) => {
        // eslint-disable-next-line
        let data = response.data.rows.map((res) => {
          let CO_code = res.startswith.slice(3, 6)
          for (let i = 0; i < CO_countyCodes.CO.length; i++) {
            if (CO_countyCodes.CO[i].code === CO_code) {
              return { x:CO_countyCodes.CO[i].name, y:res.count}
            }
          }
        })
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
          <h3>Chart data goes here</h3>
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

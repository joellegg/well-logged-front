import React, {Component} from 'react'
import axios from 'axios';

class Charts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      chartCount: true,
    }
    this.logCountDoc = this.logCountDoc.bind(this)
    this.logCountCounty = this.logCountCounty.bind(this)
  }

  componentDidMount() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { doc_type:res.doc_type, count: res.count}
        })
        console.log('data', data)
        this.setState({ chartCount: true, data: data })
      })
      .catch(err => console.log(err));
  }

  logCountDoc() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { doc_type:res.doc_type, count: res.count}
        })
        console.log('data', data)
        this.setState({ chartCount: true, data: data })
      })
      .catch(err => console.log(err));
  }

  logCountCounty() {
    console.log('count by county')
    this.setState({ chartCount: false, data: [] })
  }

  render () {
    return (
      <div>
        <h1>Charts display below</h1>
        <label className="checkbox">
          <input type="radio" className="checkbox-control" checked={this.state.chartCount} onChange={this.logCountDoc}/>
          <span className="checkbox-label">log count by doc type</span>
          <input type="radio" className="checkbox-control" checked={!this.state.chartCount} onChange={this.logCountCounty}/>
          <span className="checkbox-label">log count by county</span>
        </label>
        <div>
          <h3>Available logs will display below</h3>
          {this.state.data.map(function(log) {
            return (
              <p key={log.doc_type}>{log.doc_type} {log.count}</p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Charts;

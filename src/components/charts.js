import React, {Component} from 'react'
import axios from 'axios';

class Charts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
    }
    this.logCountDoc = this.logCountDoc.bind(this)
  }

  logCountDoc() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          // if (res.doc_type !== 'n/a') {
          //   console.log('doc, count', res.doc_type, res.count)
          // }
            return { doc_type:res.doc_type, count: res.count}
        })
        console.log('data', data)
        this.setState({ data })
      })
      .catch(err => console.log(err));
  }

  logCountCounty() {
    console.log('count by county')
  }

  render () {
    return (
      <div>
        <h1>Charts display below</h1>
        <label className="checkbox">
          <input type="radio" className="checkbox-control" onChange={this.logCountDoc}/>
          <span className="checkbox-label">log count by doc type</span>
          <input type="radio" className="checkbox-control" onChange={this.logCountCounty}/>
          <span className="checkbox-label">log count by county</span>
        </label>
        <div>
          <h3>Available logs will display below</h3>
          {this.state.data.map(function(log) {
            return (
              <h3 key={log.doc_type}>{log.doc_type} {log.count}</h3>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Charts;

import React, {Component} from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom';
import fusioncharts from 'fusioncharts';
// Load the charts module
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import './Charts.css'

// Pass fusioncharts as a dependency of charts
charts(fusioncharts)
const CO_countyCodes = require('../data/CO_countyCodes.js')

class Charts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      chartCount: true,
      chartData: {
        data: []
      }
    }
    this.countDoc = this.countDoc.bind(this)
    this.countCounty = this.countCounty.bind(this)
  }

  componentDidMount() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { label:res.doc_type, value:res.count}
        })
        this.setState({ chartCount: true, chartData: { data: data }})
      })
      .catch(err => console.log(err));
  }

  countDoc() {
    return axios.get(`http://localhost:8080/v1/countLogs`)
      .then((response) => {
        let data = response.data.rows.map((res) => {
          return { label:res.doc_type, value:res.count}
        })
        this.setState({ chartCount: true, chartData: { data: data }})
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
              return { label:CO_countyCodes.CO[i].name, value:res.count}
            }
          }
        })
        this.setState({ chartCount: false, chartData: { data: data }})
      })
      .catch(err => console.log(err));
  }

  render () {
    return (
      <div className="chart-container">
        <h3 className="chart-container-fancyFont">Log counts...</h3>
        <label className="checkbox">
          <input type="radio" className="checkbox-control" checked={this.state.chartCount} onChange={this.countDoc}/>
          <span className="checkbox-label">log count by doc type</span>
          <input type="radio" className="checkbox-control" checked={!this.state.chartCount} onChange={this.countCounty}/>
          <span className="checkbox-label">log count by county</span>
        </label>
        <div className='chart-style'>
          <ReactFC type="Column2D" className="fc-column2d" width="100%" dataFormat="JSON" dataSource={this.state.chartData} />
          {this.state.data.map(function(log) {
            return (
              <p key={log.label}>{log.label} {log.value}</p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Charts;

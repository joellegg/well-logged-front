// https://github.com/JedWatson/react-select
import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Logs.css'

// select distinct on (api) * from api_docs where api like '05-123-2345%' limit 10

class Logs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      options: [],
      complete: true,
      backspaceRemoves: true,
      apiInt: '',
      isLoading: false
    }
    this.getLogs = this.getLogs.bind(this)
    this.getApiInt = this.getApiInt.bind(this)
    this.onChange = this.onChange.bind(this)
    this.getApis = this.getApis.bind(this)
  }

  onChange (value) {
    this.setState({
      value: value,
    })
    if (value) {
      this.getLogs(value.api)
    }
  }

  getLogs (input) {
    if (!input || input.length !== 12) {
      this.setState({ data: [] })
      return Promise.resolve({ data: [] });
    } else if (input.length === 12) {
      return axios.get(`http://localhost:8080/v1/apis/${input}`)
        .then((response) => {
          let data = response.data.map((res) => {
            if (res.doc_type === 'n/a') {
              res.doc_type = 'none available'
              res.doc_link = '#'
            }
            return { api: res.api, doc_type:res.doc_type.toLowerCase(), doc_link:res.doc_link}
          })
          this.setState({ data })
        })
        .catch(err => console.log(err));
    }
  }

  getApis (input) {
    console.log('input', input.length)
    if (input.length < 7) {
      return {isLoading: false}
    }
    if (input.length > 8 && input.length < 12) {
      let options = []
      return axios.get(`http://localhost:8080/v1/apis/query/${input}`)
        .then((response) => {
          let mapped = response.data.map((res) => {
            return res.api
          })
          let filtered = mapped.filter((value, pos) => {
            return mapped.indexOf(value) == pos
          })
          for (let i = 0; i < 10; i++) {
            options.push({ api: filtered[i], apiKey: filtered[i] })
          }
          return ({ options: options })
        })
        .catch(err => console.log(err))
    }
  }

  gotoUser (value, event) {
    window.open(value.html_url)
  }

  getApiInt(event) {
    this.setState({ apiInt: event.target.value })
    this.getLogs(event.target.value)
  }

  render () {
    const AsyncComponent = Select.Async;
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>

        <AsyncComponent className="skinny" value={this.state.value} onChange={this.onChange} onValueClick={this.getLogs} valueKey="api" labelKey="apiKey" autoLoad={false} loadOptions={this.getApis} placeholder='05-###-#####' isLoading={false} />

        <div>
          <h3>Available logs will display below</h3>
          {this.state.data.map(function(log) {
            return (
              <div key={log.doc_link} className="log">
                <a className='log_href' href={'http://cogcc.state.co.us/weblink/' + log.doc_link}>
                  {log.doc_type}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Logs;

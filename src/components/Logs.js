// https://github.com/JedWatson/react-select
import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Logs.css'
import '../fonts/Kraut-type-a-fuck.ttf'

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
      return axios.get(`https://well-logged.herokuapp.com/v1/apis/${input}`)
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
    if (input.length <= 8) {
      return new Promise((resolve, reject) => {
        resolve({isLoading: false})
      })
    }
    if (input.length > 8 && input.length <= 12) {
      let options = []
      return axios.get(`https://well-logged.herokuapp.com/v1/apis/query/${input}`)
        .then((response) => {
          // console.log(response)
          let mapped = response.data.map((res) => {
            return res.api
          })
          let filtered = mapped.filter((value, pos) => {
            // eslint-disable-next-line
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

  render () {
    const AsyncComponent = Select.Async;

    return (
      <div className="section">
        <h2 className="log-section-logo">There will be logs</h2>

        <AsyncComponent
          className="skinny"
          value={this.state.value}
          onChange={this.onChange}
          onValueClick={this.getLogs}
          loadOptions={this.getApis}
          valueKey="api"
          labelKey="apiKey"
          autoLoad={false}
          placeholder='05-###-#####'
        />

        <div>
          <h3>Available logs will display here</h3>
          {this.state.data.map(function(log) {
            if (log.doc_type === 'none available') {
              return <p key={log.doc_link}>No logs available</p>
            }
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

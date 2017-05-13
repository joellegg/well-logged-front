// https://github.com/JedWatson/react-select
import React from 'react';
import Select from 'react-select';
import axios from 'axios';
import './logs.css'

// select distinct on (api) * from api_docs where api like '05-123-2345%' limit 10

const GithubUsers = React.createClass({
  // displayName: 'There will be logs',
  propTypes: {
    label: React.PropTypes.string,
  },
  getInitialState () {
    return {
      data: [],
      backspaceRemoves: true,
      multi: false,
      value: "05-"
    };
  },
  onChange (value) {
    this.setState({
      value: value,
    });
  },
  getLogs (input) {
    if (!input) {
      return Promise.resolve({ data: [] });
    } else if (input.length > 11) {
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
  },
  gotoUser (value, event) {
    window.open(value.html_url)
  },
  render () {
    const AsyncComponent = Select.Async;
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>
        <AsyncComponent className="skinny" multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getLogs} backspaceRemoves={this.state.backspaceRemoves} />
        <div>
          <h3>Data!</h3>
          {this.state.data.map(function(log) {
            return (
              <div key={log.doc_type} className="log">
                <a href={'http://cogcc.state.co.us/weblink/' + log.doc_link}>
                  {log.doc_type}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});

module.exports = GithubUsers;

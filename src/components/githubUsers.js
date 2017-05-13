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
      options: [],
      backspaceRemoves: true,
      multi: false
    };
  },
  onChange (value) {
    this.setState({
      value: value,
    });
  },
  getLogs (input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    } else if (input.length > 11) {
      return axios.get(`http://localhost:8080/v1/apis/${input}`)
        .then((response) => {
          console.log(response.data)
          this.setState({ options: response.data })
        })
        .catch(err => console.log(err));
    }
  },
  gotoUser (value, event) {
    window.open(value.html_url)
  },
  render () {
    const AsyncComponent = this.state.creatable ? Select.AsyncCreatable : Select.Async;
    return (
      <div className="section">
        <h3 className="section-heading">{this.props.label}</h3>
        <AsyncComponent className="skinny" multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getLogs} backspaceRemoves={this.state.backspaceRemoves} />
      </div>
    );
  }
});

module.exports = GithubUsers;

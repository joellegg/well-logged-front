// select doc_type, count(doc_type) from api_docs having count(doc_type) > ? group by doc_type order by count(doc_type) desc;
import React, {Component} from 'react'

class Charts extends Component {
  logSomething() {
    console.log('clicked!')
  }

  render () {
    return (
      <div>
        <h1>Charts display below</h1>
        <label className="checkbox">
          <input type="radio" className="checkbox-control" onChange={this.logSomething}/>
          <span className="checkbox-label">Single Value</span>
        </label>
      </div>
    );
  }
}

export default Charts;

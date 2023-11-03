import React from 'react'
import axios from 'axios'

export default class AppClass extends React.Component {
  constructor () {
    super ()
    this.state = {
      coords: 'Coordinates (2, 2)',
      email: '',
      steps: 0,
      message: '',
      index: 4 // the index the "B" is at
    }
  }

  getXY = () => {
    let x = 0;
    let y = 0;
    let index = this.state.index;
    if (index - 3 > 2) {
      x = 3;
      y = index - 5;
    } else if (index - 3 >= 0) {
      x = 2;
      y = index - 2;
    } else {
      x = 1;
      y = index + 1;
    }

    return ([x,y]);
  }

  getXYMessage = () => {
    const coord = this.getXY();
    const x = coord[0];
    const y = coord[1];
    
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    this.setState({
      coords: 'Coordinates (2, 2)',
      email: '',
      steps: 0,
      message: '',
      index: 4 // the index the "B" is at
    });

    return this.state;
  }

  getNextIndex = (direction) => {
    let nextIndex = this.state.index;
    if (direction === "up") {
      if (nextIndex > 2) {
        nextIndex -= 3;
      }
    } else if (direction === "right") {
      if (!Number.isInteger((nextIndex + 1)/3)) {
        nextIndex += 1;
      }
    } else if (direction === "down") {
      if (nextIndex < 6) {
        nextIndex += 3;
      }
    } else { // direction === "left"
      if (!Number.isInteger(nextIndex/3)) {
        nextIndex -= 1;
      }
    }
    
    return nextIndex;
  }

  move = (id) => {
    this.setState({
      ...this.state, 
      index: this.getNextIndex(id)
    })
  }

  onChange = (evt) => {
    let id = evt.target.id;
    if (id === 'email') {this.setState({
      ...this.state, 
      email: evt.target.value
    })}
    else if (id === 'reset') {this.reset()}
    else {
      this.move(id);
      this.setState({
        ...this.state, 
        steps: this.state.steps + 1, 
        coords: this.getXYMessage()
      })
    }
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const coords = this.getXY();
    axios.post('http://localhost:9000/api/result', {
      x: coords[0], 
      y: coords[1], 
      steps: this.state.steps, 
      email: this.state.email
    })
    .then(res => {
      this.setState({
        ...this.state,
        message: res.data.message,
        email: ''
      })
    })
    .catch(err => console.log(err));    
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.state.coords}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.onChange}>LEFT</button>
          <button id="up" onClick={this.onChange}>UP</button>
          <button id="right" onClick={this.onChange}>RIGHT</button>
          <button id="down" onClick={this.onChange}>DOWN</button>
          <button id="reset" onClick={this.onChange}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange} />
          <input id="submit" type="submit" />
        </form>
      </div>
    )
  }
}

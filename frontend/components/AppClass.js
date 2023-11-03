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
    let xy = {
      0: [1,1],
      1: [2,1],
      2: [3,1],
      3: [1,2],
      4: [2,2],      
      5: [3,2],      
      6: [1,3],      
      7: [2,3],      
      8: [3,3]
    };
    let index = this.state.index;
    console.log(index);

    return (xy[index]);
  }

  getXYMessage = () => {
    const coord = this.getXY();
    const x = coord[0];
    const y = coord[1];
    this.setState({
      ...this.state,
      message: `Coordinates (${x}, ${y})`
    });

    return this.state;
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
    let newIndex = this.state.index;
    if (direction === "up") {
      newIndex -= 3
    } else if (direction === "right" && newIndex !== (2 || 5 || 8)) {
      newIndex += 1
    } else if (direction === "left" && newIndex !== (0 || 3 || 6)) {
      newIndex -= 1
    } else { // direction === "down"
      newIndex += 3
    }

    if (8 >= newIndex && newIndex >= 0) {
      this.setState({
        ...this.state,
        index: newIndex,
        steps: this.state.steps + 1
      })
    }
    
    return this.state;
  }

  move = (id) => {
    const oldIndex = this.state.index;
    this.getNextIndex(id);
    if(oldIndex !== this.state.index) {
      this.getXYMessage()
    }
  }

  onChange = (evt) => {
    let id = evt.target.id;
    if (id === 'email') {this.setState({
      ...this.state, 
      email: evt.target.value
    })}
    else if (id === 'reset') {this.reset()}
    else {this.move(id)}
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
    .catch(err => {
      this.setState({
        ...this.state,
        message: err.response.data.message,
        email: ''
      })
    });    
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

// Those numbers are calculated based on the data you're submitting. I notice that your coordinates don't update quite right and that it keeps adding to the move count even when it shouldn't be able to move. For example, it shouldn't be able to go higher than the top row and should be returning a message when you try and not increasing the move count in that case.
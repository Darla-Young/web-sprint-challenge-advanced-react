import React from 'react'
import axios from 'axios'

export default class AppClass extends React.Component {
  constructor () {
    super ()
    this.state = {
      coords: 'Coordinates (2, 2)', // set by getXY()
      steps: 0,
      index: 4, // the index the "B" is at
      message: '',
      email: ''
    }
  }

  getNextIndex = (direction) => {
    const oldIndex = this.state.index;
    let newIndex = this.state.index;
    if (direction === "up" && (oldIndex !== 0) && (oldIndex !== 1) && (oldIndex !== 2)) {
      newIndex = newIndex - 3;
    } else if (direction === "right" && (oldIndex !== 2) && (oldIndex !== 5) && (oldIndex !== 8)) {
      newIndex = newIndex + 1;
    } else if (direction === "left" && (oldIndex !== 0) && (oldIndex !== 3) && (oldIndex !== 6)) {
      newIndex = newIndex - 1;
    } else if (direction === "down" && (oldIndex !== 6) && (oldIndex !== 7) && (oldIndex !== 8)) { 
      newIndex = newIndex + 3;
    } else {newIndex}
    
    return newIndex;
  }

  getXY = (index) => {
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

    return (xy[index]);
  }

  getXYMessage = (coord) => {
    return `Coordinates (${coord[0]}, ${coord[1]})`
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

  onChange = (evt) => {
    this.setState({
      ...this.state, 
      email: evt.target.value
    })
  }

  onClick = (evt) => {
    const id = evt.target.id;
    if (id === "reset") {this.reset()}
    else if (this.state.index !== this.getNextIndex(id)) {
      console.log(this.state.index + " -> " + this.getNextIndex(id));
      this.setState({
        ...this.state,
        index: this.getNextIndex(id),
        steps: this.state.steps + 1,
        coords: this.getXYMessage(this.getXY(this.getNextIndex(id)))
      });
    } else {
      this.setState({
        ...this.state,
        message: `You can't go ${id}`
      })
    }
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const coords = this.getXY(this.state.index);
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
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? "time" : "times"}</h3>
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
          <button id="left" onClick={this.onClick}>LEFT</button>
          <button id="up" onClick={this.onClick}>UP</button>
          <button id="right" onClick={this.onClick}>RIGHT</button>
          <button id="down" onClick={this.onClick}>DOWN</button>
          <button id="reset" onClick={this.onClick}>reset</button>
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
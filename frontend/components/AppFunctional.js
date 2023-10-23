import React, { useState } from 'react';
import axios from 'axios';

export default function AppFunctional(props) {
  const [ coords, setCoords ] = useState('Coordinates (2, 2)');
  const [ email, setEmail ] = useState('');
  const [ steps, setSteps ] = useState(0);
  const [ message, setMessage ] = useState('');
  const [ index, setIndex ] = useState(4); // the index the "B" is at

  function getXY() {
    let x = 0;
    let y = 0;
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

  function getXYMessage() {
    const coord = getXY();
    const x = coord[0];
    const y = coord[1];
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setCoords('Coordinates (2, 2)');
    setEmail('');
    setSteps(0);
    setIndex(4);
    setMessage('');

    return '';
  }

  function getNextIndex(direction) {
    let nextIndex = index;
    if (direction === "up") {
      if (index > 2) {
        nextIndex -= 3;
      }
    } else if (direction === "right") {
      if (!Number.isInteger((index + 1)/3)) {
        nextIndex += 1;
      }
    } else if (direction === "down") {
      if (index < 6) {
        nextIndex += 3;
      }
    } else { // direction === "left"
      if (!Number.isInteger(index/3)) {
        nextIndex -= 1;
      }
    }
    
    return nextIndex;
  }

  function move(evt) {
    const nextIndex = getNextIndex(evt);
    setIndex(nextIndex);
  }

  function onChange(evt) {
    let id = evt.target.id;
    if (id === 'email') {setEmail(evt.target.value)}
    else if (id === 'reset') {reset()}
    else {
      move(id);
      setSteps(steps + 1);
      setCoords(getXYMessage())
    }
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const coords = getXY();
    axios.post('http://localhost:9000/api/result', {
      x: coords[0], 
      y: coords[1], 
      steps: steps, 
      email: email
    })
    .then(res => {
      setMessage(res.data.message);
      setEmail('');
    })
    .catch(err => console.log(err));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{coords}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={onChange}>LEFT</button>
        <button id="up" onClick={onChange}>UP</button>
        <button id="right" onClick={onChange}>RIGHT</button>
        <button id="down" onClick={onChange}>DOWN</button>
        <button id="reset" onClick={onChange}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  )
}

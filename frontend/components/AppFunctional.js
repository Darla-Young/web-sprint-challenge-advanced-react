import React, { useState } from 'react';
import axios from 'axios';

export default function AppFunctional(props) {
  const [ coords, setCoords ] = useState('Coordinates (2, 2)');
  const [ email, setEmail ] = useState('');
  const [ steps, setSteps ] = useState(0);
  const [ message, setMessage ] = useState('');
  const [ index, setIndex ] = useState(4); // the index the "B" is at

  function getNextIndex(direction) {
    const oldIndex = index;
    let newIndex = index;
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

  function getXY(index) {
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

  function getXYMessage(coord) {
    return `Coordinates (${coord[0]}, ${coord[1]})`
  }

  function reset() {
    setCoords('Coordinates (2, 2)');
    setEmail('');
    setSteps(0);
    setIndex(4);
    setMessage('');
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onClick(evt) {
    const id = evt.target.id;
    if (id === "reset") {reset()}
    else if (index !== getNextIndex(id)) {
      setIndex(getNextIndex(id));
      setSteps(steps + 1);
      setCoords(getXYMessage(getXY(getNextIndex(id))));
    } else {
      setMessage(`You can't go ${id}`);
    }
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const coords = getXY(index);
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
    .catch(err => {
      setMessage(err.response.data.message);
      setEmail('');
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{coords}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? "time" : "times"}</h3>
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
        <button id="left" onClick={onClick}>LEFT</button>
        <button id="up" onClick={onClick}>UP</button>
        <button id="right" onClick={onClick}>RIGHT</button>
        <button id="down" onClick={onClick}>DOWN</button>
        <button id="reset" onClick={onClick}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  )
}

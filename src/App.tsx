import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState('#ffffff');
  const onClick = async() => {
    const [tab]= await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript<string[],void>({
      target: {tabId: tab.id!},
      args: [color],
      func: (color) => {
       document.body.style.backgroundColor = color;
      }
    });
  }

  return (
    <>
      <div>
        <input type='color' onChange={(e)=>{setColor(e.currentTarget.value)}}></input>
      </div>
      <h1>Bg collor</h1>
      <div className="card">
        <button onClick={() => onClick()}>
          change
        </button>
        <p>
          chnaging te coller of the current page
        </p>
      </div>
      
    </>
  )
}

export default App

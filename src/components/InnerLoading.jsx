import React from 'react'

export default React.createClass({
  render(){
    return <div style={{width: "100%", height: "100%", "minHeight": "250px", position: "relative"}}>
      <img src="/img/loading-big.svg" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />
    </div>
  }
})

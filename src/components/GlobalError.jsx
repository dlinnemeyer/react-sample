import React from 'react'

export default React.createClass({
  render(){
    return <div style={{top: "0", opacity: "0.7", width: "100%", height: "100%", background: "lightGrey", position: "fixed"}}>
      <div style={{color: "red", fontSize: "32px", background: "white", padding: "30px", opacity: "1", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        {this.props.message}
      </div>
    </div>
  }
})


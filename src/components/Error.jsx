import React from 'react'

export default React.createClass({
  render(){
    return <div className="error" style={{fontWeight: "bold", fontSize: "18px"}}>
      {this.props.message}
    </div>
  }
})

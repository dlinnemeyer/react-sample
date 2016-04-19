import React from 'react';

export default React.createClass({
  render(){
    return <div style={{top: "0", opacity: "0.2", width: "100%", height: "100%", background: "lightGrey", position: "fixed"}}>
      <div style={{padding: "20px", opacity: "1", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
        <img src="/img/loading-big.svg" />
      </div>
    </div>;
  }
});

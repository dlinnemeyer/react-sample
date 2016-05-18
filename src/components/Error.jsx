import React, {PropTypes} from 'react'

export default function Error({message}){
  return <div className="error" style={{fontWeight: "bold", fontSize: "18px"}}>
    {message}
  </div>
}
Error.propTypes = {
  message: PropTypes.string.isRequired
}

import {browserHistory as history} from 'react-router'
import {stringify, parse} from 'qs'
import {isString, mapValues, keyBy} from 'lodash'
import {PropTypes} from 'react'

// because I could not get customizable query string serializers/deserializers working with
// react-router. no idea why
export function push(location){
  if(isString(location)) return history.push(location)

  const { pathname, query } = location
  let querystring = stringify(query)
  if(querystring.length) querystring = `?${querystring}`
  return history.push(pathname + querystring)
}

export function getQuery(location){
  return location.search.length
    ? parse(location.search.slice(1))
    : {}
}

export function reduxFormPropTypes(fields){
  // key to field name, and the value being an object proptype
  // technically we don't allow object proptypes, but we're pulling from redux-form, so eh
  fields = mapValues(keyBy(fields), () => PropTypes.object.isRequired)

  return {
    fields: PropTypes.shape(fields).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    submitFailed: PropTypes.bool.isRequired
  }
}

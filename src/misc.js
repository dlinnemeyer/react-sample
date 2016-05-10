import {browserHistory as history} from 'react-router'
import {stringify, parse} from 'qs'
import {isString} from 'lodash'

export function arrToHash(arr, key = "id"){
  return arr.reduce((obj, x) => {
    if(!x) return obj

    obj[x[key]] = x
    return obj
  }, {})
}

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

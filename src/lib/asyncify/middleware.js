import _, {map, pickBy, includes, size, each, assign} from 'lodash'
import {mergeSettings} from './actions'

// pass this function a push function, and it'll return middleware for refux that calls that
// push function with relevant query string values every time settings change
export const queryStringMiddleware = push => {
  const _settingsMiddleware = settingsMiddleware(push)
  return store => next => action => {
    switch(action.type){
    case 'COMPONENT_MERGE_SETTINGS':
    case 'COMPONENT_REPLACE_SETTINGS':
      return _settingsMiddleware(store, next, action)
    case 'COMPONENT_MOUNT':
      return mountComponentMiddleware(store, next, action)
    case '@@router/LOCATION_CHANGE':
      return locationChangeMiddleware(store, next, action)
    default:
      return next(action)
    }
  }
}

const settingsMiddleware = push => {
  return (store, next, action) => {
    const result = next(action)
    if(!includes(['COMPONENT_MERGE_SETTINGS', 'COMPONENT_REPLACE_SETTINGS'], action.type)) return result

    const { channel, settings } = action
    if(!channel.settingsToQueryString) return result

    // filter settings down to qs-pushable settings for this channel
    const currentQuery = store.getState().routing.locationBeforeTransitions.query
    const qsSettings = pickBy(settings, (value, key) => {
      return includes(channel.settingsToQueryString, key) && currentQuery[key] !== value
    })
    if(!size(qsSettings)) return result

    const newQuery = assign({}, currentQuery, qsSettings)
    const currentPath = store.getState().routing.locationBeforeTransitions.pathname
    store.dispatch(push({pathname: currentPath, query: newQuery}))

    return result
  }
}

// grab query string from router when component mounts
const mountComponentMiddleware = (store, next, action) => {
  const query = store.getState().routing.locationBeforeTransitions.query

  // sync query settings into each channel. be careful not to modify original channel objects
  // query string over-rides their channel defaults
  action.channels = map(action.channels, channel => {
    const newChannel = assign({}, channel)
    newChannel.settings = assign({}, channel.settings, getSettingsFromQuery(channel, query))
    return newChannel
  })

  return next(action)
}

const locationChangeMiddleware = (store, next, action) => {
  const result = next(action)
  if(action.type !== '@@router/LOCATION_CHANGE') return result
  const components = store.getState().components
  if(!components) return result

  // grab all channel objects from all current components
  const query = action.payload.query
  const currentChannels = _(components).map(_.values).flatten().value()
  each(currentChannels, channel => {
    const settingsToPush = getSettingsFromQuery(channel, query)

    if(!size(settingsToPush)) return
    store.dispatch(mergeSettings(channel, settingsToPush))
  })

  return result
}

function getSettingsFromQuery(channel, query){
  return _(query).pick(channel.settingsToQueryString)
    .pickBy((val, key) => channel.settings[key] !== val).value()
}

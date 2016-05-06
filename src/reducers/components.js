function set(state, id, subId, key, data){
  const component = state[id] || {};
  // this just overrides the data set on key. we don't merge for that, though we obviously merge
  // for sub-components and components so we don't run over that data
  const subComponent = Object.assign({}, component[subId] || {}, {
    [key]: data
  });
  // immutable is silly when you get three keys deep, ain't it?
  const mergedComponent = Object.assign({}, component, {
    [subId] : subComponent
  });

  return Object.assign({}, state, {
    [id]: mergedComponent
  });
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'COMPONENT_DATA':
    return set(state, action.id, action.subId, 'data', action.data);
  case 'COMPONENT_LOADING':
    return set(state, action.id, action.subId, 'loading', action.isLoading);
  case 'COMPONENT_ERROR':
    return set(state, action.id, action.subId, 'error', action.message);
  case 'COMPONENT_SETTINGS':
    return set(state, action.id, action.subId, 'settings', action.settings);
  }
  return state;
}

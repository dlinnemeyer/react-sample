function error(state, id, message){
  return Object.assign({}, state, {
    [id]: message
  });
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'ERROR':
    return error(state, action.id, action.message);
  }
  return state;
}


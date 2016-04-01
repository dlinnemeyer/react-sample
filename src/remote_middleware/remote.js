// should be importing this setTimeout method? either way, we'd actually be doing ajax here.
// and in reality, we'd be pulling from some other libraries that handle this stuff and return
// promises? like saveVote(entry).then(() => store.dispatch(action))

function remoteVote(store, next, action){
  // need to do this because we're delaying the dispatching of this action, dispatching it again
  // later. we'll create an infinite loop without this
  if(action.loaded) return next(action);

  action.loaded = true;
  window.setTimeout(() => store.dispatch(action), 1500);
  return next({
    type: 'LOADING',
    loading: true
  });
}

export default store => next => action => {
  switch(action.type){
  case 'VOTE':
    return remoteVote(store, next, action);
  default:
    return next(action);
  }
}

 import {List,Map} from 'immutable';

function setState(state, newState){
  return state.merge(newState);
}

function vote(state, entry){
  const pair = state.getIn(['vote','pair']);
  if(pair && pair.includes(entry)){
    return state.set('hasVoted', entry);
  }
  else {
    return state;
  }
}

function resetVote(state) {
  const hasVoted = state.get('hasVoted');
  const currentPair = state.getIn(['vote', 'pair'], List());
  if (hasVoted && !currentPair.includes(hasVoted)) {
    return state.remove('hasVoted');
  }
  else {
    return state;
  }
}

function loading(state){
  return state.set('loading', true);
}

function loaded(state){
  return state.set('loading', false);
}

export default function(state = Map(), action) {
  if(action.loaded) state = loaded(state);

  switch (action.type) {
  case 'SET_STATE':
    return resetVote(setState(state, action.state));
  case 'VOTE':
    return vote(state, action.entry);
  case 'LOADING':
    return loading(state, action.loading);
  }
  return state;
}

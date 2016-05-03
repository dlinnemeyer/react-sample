function setPageData(state, pageId, data){
  const oldData = state[pageId] || {};
  return Object.assign({}, state, {
    [pageId]: Object.assign({}, oldData, data)
  });
}

export default function(state = {}, action) {
  switch (action.type) {
  case 'SET_PAGE_DATA':
    return setPageData(state, action.id, action.data);
  }
  return state;
}


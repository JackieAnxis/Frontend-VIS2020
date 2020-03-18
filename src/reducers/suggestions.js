import {
    GOT_SEARCH_RESULT
} from "../actions/suggestions"
import {
  SET_LASSO_RESULT
} from "../actions/wholeGraph";

const initSuggestions = {
    subgraphs: []
}

export function suggestions(state = initSuggestions, action) {
    switch (action.type) {
        case GOT_SEARCH_RESULT:
            return Object.assign({}, state, {
                subgraphs: action.data
            })
        case SET_LASSO_RESULT:
          if (action.lassoType === 'source') {
            return Object.assign({}, state, initSuggestions);
          } else {
            return state;
          }
          
    }
    return state;
}
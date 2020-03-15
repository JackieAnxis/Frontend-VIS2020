import {
    GOT_SEARCH_RESULT
} from "../actions/suggestions"
import {
  NEW_EXEMPLAR
} from "../actions/exemplar";

const initSuggestions = {
    subgraphs: []
}

export function suggestions(state = initSuggestions, action) {
    switch (action.type) {
        case GOT_SEARCH_RESULT:
            return Object.assign({}, state, {
                subgraphs: action.data
            })
        case NEW_EXEMPLAR:
          return Object.assign({}, state, initSuggestions)
    }
    return state;
}
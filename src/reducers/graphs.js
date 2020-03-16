import { SET_LASSO_RESULT } from "../actions/wholeGraph";

const initGraphs = {
    source: null,
    target: null,
    sourceModified: null,
    targetGenerated: null,
}

export function graphs(state = initGraphs, action) {
    switch (action.type) {
        case SET_LASSO_RESULT: {
            if (action.lassoType === 'source') {
                return Object.assign({}, state, {
                    source: action.data
                })
            } else {
                return Object.assign({}, state, {
                    target: action.data
                })
            }
        }
        default:
            return state;
    }
}
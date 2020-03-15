import { TOGGLE_LASSO_TYPE } from "../actions/wholeGraph";

const initState = {
    type: 'source'
}

export function lasso(state = initState, action) {
    switch (action.type) {
        case TOGGLE_LASSO_TYPE:
            return Object.assign({}, state, {
                type: action.selectType,
            })
        default:
            return state
    }
}
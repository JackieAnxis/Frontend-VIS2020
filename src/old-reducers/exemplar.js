import {
    NEW_EXEMPLAR, AUTO_LAYOUT
} from "../actions/exemplar";

const initExemplar = {
    autoLayout: false,
    graph: null
}

export function exemplar(state = initExemplar, action) {
    switch (action.type) {
        case NEW_EXEMPLAR:
            return Object.assign({}, state, {
                autoLayout: false,
                graph: action.data
            });
        case AUTO_LAYOUT:
            return Object.assign({}, state, {
                autoLayout: true
            });
    }
    return state;
}
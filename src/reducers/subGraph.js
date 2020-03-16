import { GOT_SUB_GRAPH } from '../actions/subGraph';

const initSubGraph = {
}

export function subGraph(state = initSubGraph, action) {
    switch (action.type) {
        case GOT_SUB_GRAPH:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}
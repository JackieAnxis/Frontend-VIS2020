import { GOT_WHOLE_GRAPH } from '../actions/wholeGraph';

const initWholeGraph = {
    name: '',
    graph: null,
    lassoType: 'source',
}

export function wholeGraph(state = initWholeGraph, action) {
    switch (action.type) {
        case GOT_WHOLE_GRAPH:
            return Object.assign({}, state, {
                name: action.data.name,
                graph: action.data.data,
            });
        default:
            return state;
    }
}
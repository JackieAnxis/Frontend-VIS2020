import { GOT_WHOLE_GRAPH } from '../actions/wholeGraph';
import { GOT_WHOLEGRAPH_DEFORMATION_RESULT } from '../actions/deformation'

const initWholeGraph = {
    name: '',
    graph: null,
}

export function wholeGraph(state = initWholeGraph, action) {
    switch (action.type) {
        case GOT_WHOLE_GRAPH:
            return Object.assign({}, state, {
                name: action.data.name,
                graph: action.data.data,
                // cluster: action.data.cluster
            });
        case GOT_WHOLEGRAPH_DEFORMATION_RESULT:
            // to add
            return Object.assign({}, state, {
                graph:action.data
            })
    }
    return state;
}
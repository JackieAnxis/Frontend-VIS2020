import { GOT_WHOLE_GRAPH, SWITCH_LASSO_TYPE, SET_VIEW_CENTER } from '../actions/wholeGraph';
import { GOT_WHOLEGRAPH_DEFORMATION_RESULT } from '../actions/deformation';

const initWholeGraph = {
    name: '',
    graph: null,
    lassoType: 'source',
    viewCenter: null
}

export function wholeGraph(state = initWholeGraph, action) {
    switch (action.type) {
        case GOT_WHOLE_GRAPH:
            return Object.assign({}, state, {
                name: action.data.name,
                graph: action.data.data,
            });
        case SWITCH_LASSO_TYPE:
            return Object.assign({}, state, {
                lassoType: action.lassoType
            });
        case GOT_WHOLEGRAPH_DEFORMATION_RESULT:
            return Object.assign({}, state, {
              graph: action.data,
            })
        case SET_VIEW_CENTER:
            return Object.assign({}, state, {
              viewCenter: action.data,
            })
        default:
            return state;
    }
}
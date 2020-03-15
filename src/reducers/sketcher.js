import { SET_SKETCH_EXEMPLAR } from "../actions/sketcher";

const initSketcher = {
    graph: {
        nodes: [],
        links: []
    }
}

export function sketcher(state = initSketcher, action) {
    switch (action.type) {
        case SET_SKETCH_EXEMPLAR:
            return Object.assign({}, state, {
                graph: action.graph
            });
        default:
            return state;
    }
}
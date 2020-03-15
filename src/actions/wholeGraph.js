import {
    backendAddress
} from '../config'
export const REQUEST_WHOLE_GRAPH = 'REQUEST_WHOLE_GRAPH';
export const GOT_WHOLE_GRAPH = 'GOT_WHOLE_GRAPH';
export const TOGGLE_LASSO = 'TOGGLE_LASSO';

function gotWholeGraph(data) {
    return {
        type: GOT_WHOLE_GRAPH,
        data
    }
}

// TODO: no use, call directly
export function toggleLasso(enable) {
    return {
        type: TOGGLE_LASSO,
        enable
    }
}

export function requestWholeGraph() {
    const url = `${backendAddress}/whole-graph`;
    console.log('requesting..');
    return dispatch => {
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                dispatch(gotWholeGraph(data));
            });
    };
}
import { store } from '../App';
import {
    backendAddress
} from '../config';
export const REQUEST_WHOLE_GRAPH = 'REQUEST_WHOLE_GRAPH';
export const GOT_WHOLE_GRAPH = 'GOT_WHOLE_GRAPH';
export const TOGGLE_LASSO = 'TOGGLE_LASSO';
export const LASSO_DATA = 'LASSO_DATA';
export const TOGGLE_LASSO_TYPE = 'TOGGLE_LASSO_TYPE';

export function lassoData(data) {
    const state = store.getState();
    return {
        type: LASSO_DATA,
        lassoType: state.lasso.type,
        data,
    }
}

export function toggleLassoSelect(selectType) {
    return {
        type: TOGGLE_LASSO_TYPE,
        selectType
    }
}

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
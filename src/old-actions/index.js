import {
    store
} from "../App";
import {
    backendAddress
} from '../config'

export const REQUEST_DATA = 'REQUEST_DATA';
export const GOT_DATA = 'GOT_DATA';
export const MODIFY_GRAPH = 'MODIFIED_GRAPH';
export const COMPUTE = 'COMPUTE';
export const GOT_COMPUTE_RESULT = 'GOT_COMPUTE_RESULT';

export function modifyGraph(name, data) {
    return {
        type: MODIFY_GRAPH,
        graphName: name,
        data: data,
    }
}

function gotData(data) {
    return {
        type: GOT_DATA,
        data: data,
    };
}

export function requestData() {
    const url = `${backendAddress}/test`;
    console.log('requesting..');
    return dispatch => {
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                dispatch(gotData(data));
            });
    };
}

export function compute() {
    const state = store.getState();
    console.log(state);
    console.log('computing...');
    const url = `${backendAddress}/compute`;
    const postData = {
        source: state.testGraphs.source,
        target: state.testGraphs.target,
        source_modified: state.modifiedGraphs.source_modified ? state.modifiedGraphs.source_modified : state.testGraphs.source,
    }
    return dispatch => {
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
            .then(res => {
                const json = res.json();
                console.log(json);
                return json;
            })
            .then(data => {
                dispatch(gotResult(data));
            });
    }
}

export function gotResult(data) {
    return {
        type: GOT_COMPUTE_RESULT,
        data: data,
    };
}
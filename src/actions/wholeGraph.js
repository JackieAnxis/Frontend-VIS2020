import { backendAddress } from '../configs'
export const REQUEST_WHOLE_GRAPH = 'REQUEST_WHOLE_GRAPH';
export const GOT_WHOLE_GRAPH = 'GOT_WHOLE_GRAPH';

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

function gotWholeGraph(data) {
    return {
        type: GOT_WHOLE_GRAPH,
        data
    }
}

import {
    store
} from "../App";
import {
    backendAddress
} from "../config";
import {
    gotSearchResult
} from "./suggestions";

export const NEW_EXEMPLAR = 'NEW_EXEMPLAR';
export const SEARCH_EXEMPLAR = 'SEARCH_EXEMPLAR';
export const AUTO_LAYOUT = 'AUTO_LAYOUT';

export function autoLayout() {
    return {
        type: AUTO_LAYOUT,
    }
}

export function newExemplar(data) {
    return {
        type: NEW_EXEMPLAR,
        data,
    }
}

export function search() {
    const state = store.getState();
    const graph = state.exemplar.graph;
    // TODO: check graph valid
    const postData = {
        dataset: state.wholeGraph.name,
        nodes: graph.nodes.map(n => n.id)
    };
    // const url = `${backendAddress}/search`;
    const url = `${backendAddress}/search-v2`;

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
                return json;
            })
            .then(data => {
                dispatch(gotSearchResult(data));
            });
    }
}
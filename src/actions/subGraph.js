import { backendAddress } from '../configs'
export const GOT_SUB_GRAPH = 'GOT_SUB_GRAPH';

export function generateSubgraph(postData) {
    const url = `${backendAddress}/sub-graph`;
    return dispatch => {
        return fetch(url,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          })
          .then(res => res.json())
          .then(data => {
              dispatch(gotSubGraph(data));
          });
    };
}

function gotSubGraph(data) {
    return {
        type: GOT_SUB_GRAPH,
        data
    }
}

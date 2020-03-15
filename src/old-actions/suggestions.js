import {
    backendAddress, searchAPI
} from '../config'
export const GOT_SEARCH_RESULT = 'GOT_SEARCH_RESULT'

export function gotSearchResult(subgraphs) {
    return {
        type: GOT_SEARCH_RESULT,
        data: subgraphs
    }
}

export function requestSuggestions(postData) {
    const url = `${backendAddress}/${searchAPI}`
    return (dispatch) => {
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then((res) => res.json())
            .then((data) => {
                dispatch(gotSearchResult(data.suggestions))
            })
    }
}
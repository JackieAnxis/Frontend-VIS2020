import {
  backendAddress
} from '../configs'

import { setTargetGenerated } from './graphs'

export const GOT_DEFORMATION_RESULT = 'GOT_DEFORMATION_RESULT'
export const SET_DEFORMATION_MARKER = 'SET_DEFORMATION_MARKER'
export const SET_DEFORMATION_GRAPH = 'SET_DEFORMATION_GRAPH'
export const COPY_DEFORMATION_HISTORY = 'COPY_DEFORMATION_HISTORY'
export const GOT_WHOLEGRAPH_DEFORMATION_RESULT = 'GOT_WHOLEGRAPH_DEFORMATION_RESULT'


export function gotDeformationResult(targetGraphId, data) {
  let res = {};
  // const {deformedTargetGraph, newG} = data;
  res[targetGraphId] = data;
  return {
    type: GOT_DEFORMATION_RESULT,
    data: res//[res, newG]
  }
}

export function setDeformationMarker(data) {
  return {
    type: SET_DEFORMATION_MARKER,
    data: data
  }
}

export function setDeformationGraph(data) {
  return {
    type: SET_DEFORMATION_GRAPH,
    data: data
  }
}

export function copyDeformationHistory(data) {
  return {
    type: COPY_DEFORMATION_HISTORY,
    data: data
  }
}

export function applyDeformationToSubgraph(postData) {
  const url = `${backendAddress}/apply-deformation`;
  const graphId = postData.graphId;
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
        // dispatch(gotDeformationResult(postData.targetGraphId, data))
        dispatch(setTargetGenerated(data, graphId))
      })
  }
}

export function gotWholeGraphDeformationResult(data) {
  return {
    type: GOT_WHOLEGRAPH_DEFORMATION_RESULT,
    data: data
  }
}

export function applyDeformationToWholegraph(postData) {
  const url = `${backendAddress}/apply-deformation-wholegraph`
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
        dispatch(gotWholeGraphDeformationResult(data))
      })
  }
}


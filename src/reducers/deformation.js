import {
  GOT_DEFORMATION_RESULT,
  SET_DEFORMATION_MARKER,
  SET_DEFORMATION_GRAPH,
  COPY_DEFORMATION_HISTORY
} from "../actions/deformation"
import {
  NEW_EXEMPLAR
} from "../actions/exemplar";

const initDeformation = {
  deformedSourceGraph: null,
  deformedTargetGraph: null
}

export function deformation(state = {}, action) {
  switch (action.type) {
    // case GOT_WHOLEGRAPH_DEFORMATION_RESULT:
    //   return Object.assign({}, state)
    case GOT_DEFORMATION_RESULT:
      state.deformedTargetGraph = {...state.deformedTargetGraph, ...action.data}
      return Object.assign({}, state)
    case SET_DEFORMATION_MARKER:
      // 新框选后要清空之前的子图marker
      if ("exemplar" in action.data) {
        state.allMarker = action.data;
      } else {
        state.allMarker = {...state.allMarker, ...action.data}
      }
      return Object.assign({}, state)
    case SET_DEFORMATION_GRAPH:
      if ("history" in state) {
        state.history.unshift({
          "beforeGraph": JSON.parse(JSON.stringify(action.data.prev)),// 防止力引导图作用的影响
          "afterGraph": JSON.parse(JSON.stringify(action.data.cur)),
          'marker': state.allMarker["exemplar"]
        })
      } else {
        state.history = [{
          "beforeGraph": JSON.parse(JSON.stringify(action.data.prev)),
          "afterGraph": JSON.parse(JSON.stringify(action.data.cur)),
          'marker': state.allMarker["exemplar"]
        }]
      }
      state.allMarker.markerForDeform = state.allMarker["exemplar"];// 当前转换使用的marker
      return Object.assign({}, state, {
        deformedSourceGraph: action.data.cur,
        sourceGraph: action.data.prev
      })
    case COPY_DEFORMATION_HISTORY:
      let newDeformedSourceGraph = state.history[action.data].afterGraph;
      let newSourceGraph = state.history[action.data].beforeGraph;
      state.allMarker.markerForDeform = state.history[action.data].marker;// 当前转换使用的marker
      return Object.assign({}, state, {
        deformedSourceGraph: newDeformedSourceGraph,
        sourceGraph: newSourceGraph
      });
    case NEW_EXEMPLAR:
      return Object.assign({}, state, initDeformation)
  }
  return state;
}
import { SET_LASSO_RESULT } from "../actions/wholeGraph";
import { SET_DEFORMATION_GRAPH } from "../actions/deformation";
import {
  GOT_SEARCH_RESULT
} from "../actions/suggestions"
import {
    ADD_SOURCE_MARKER,
    ADD_TARGET_MARKER,
    SET_TARGET_GENERATED,
} from "../actions/graphs"
import { CLEAR_SOURCE_MARKER } from "../actions/graphs"
import { CLEAR_TARGET_MARKER } from "../actions/graphs"

const initGraphs = {
    source: {
      sourceOrigin: null,
      sourceModified: null,
      sourceMarkers: []
    }, //source只有一个 
    target: {

    } // target可以有多个 id : {targetMarkers, targetOrigin, targetGenerated}
    // sourceMarkers: [],
    // targetMarkers: [],
    // source: null,
    // target: null,
    // sourceModified: null,
    // targetGenerated: null,
}

export function graphs(state = initGraphs, action) {
    switch (action.type) {
        case SET_LASSO_RESULT: {
            if (action.lassoType === 'source') {
                state.source = {
                  sourceOrigin: action.data,
                  sourceModified: null,
                  sourceMarkers: []
                }
                state.target = {}
                return Object.assign({}, state)
            } else {
                const id = "subgraph-" + Object.keys(state.target).length;
                let newTarget = {};
                newTarget[id] = {
                  targetOrigin: action.data,
                  targetGenerated: null,
                  targetMarkers: []
                };
                state.target = Object.assign({}, newTarget, state.target)
                return Object.assign({}, state)
            }
        }
        case SET_DEFORMATION_GRAPH: {
            state.source.sourceModified = action.data
            return Object.assign({}, state)
        }
        case SET_TARGET_GENERATED:
          state.target[action.graphId].targetGenerated = action.data
            return Object.assign({}, state)

        case ADD_SOURCE_MARKER: {
            state.source.sourceMarkers.push(action.id)
            return Object.assign({}, state)
        }
        case ADD_TARGET_MARKER: {
            state.target[action.graphId].targetMarkers.push(action.nodeId)
            return Object.assign({}, state)
        }
        case CLEAR_SOURCE_MARKER: {
          state.source.sourceMarkers = []
            return Object.assign({}, state)
        }
        case CLEAR_TARGET_MARKER: {
           // to modify
            return Object.assign({}, state, {
                targetMarkers: []
            })
        }

        // 搜索得到的结果也是deform候选
        case GOT_SEARCH_RESULT:
            const length = Object.keys(state.target).length;
            action.data.forEach((d,i) => {
              state.target[`subgraph-${length+action.data.length-i-1}`] = {
                targetMarkers: [],
                targetOrigin: d.graph,
                targetGenerated: null
              }
            })
            return Object.assign({}, state)

        default:
            return state;
    }
}
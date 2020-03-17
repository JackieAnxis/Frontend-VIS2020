import { SET_LASSO_RESULT } from "../actions/wholeGraph";
import { SET_DEFORMATION_GRAPH } from "../actions/deformation";

import {
    ADD_SOURCE_MARKER,
    ADD_TARGET_MARKER,
    SET_TARGET_GENERATED,
} from "../actions/graphs"
import { CLEAR_SOURCE_MARKER } from "../actions/graphs"
import { CLEAR_TARGET_MARKER } from "../actions/graphs"

const initGraphs = {
    sourceMarkers: [],
    targetMarkers: [],
    source: null,
    target: null,
    sourceModified: null,
    targetGenerated: null,
}

export function graphs(state = initGraphs, action) {
    switch (action.type) {
        case SET_LASSO_RESULT: {
            if (action.lassoType === 'source') {
                return Object.assign({}, state, {
                    source: action.data,
                    sourceMarkers: []
                })
            } else {
                return Object.assign({}, state, {
                    target: action.data,
                    targetMarkers: []
                })
            }
        }
        case SET_DEFORMATION_GRAPH: {
            return Object.assign({}, state, {
                sourceModified: action.data
            })
        }
        case SET_TARGET_GENERATED:
            return Object.assign({}, state, {
                targetGenerated: action.data
            })

        case ADD_SOURCE_MARKER: {
            const newMarkers = state.sourceMarkers
            newMarkers.push(action.id)
            return Object.assign({}, state, {
                sourceMarkers: newMarkers
            })
        }
        case ADD_TARGET_MARKER: {
            const newMarkers = state.targetMarkers
            newMarkers.push(action.id)
            return Object.assign({}, state, {
                targetMarkers: newMarkers
            })
        }
        case CLEAR_SOURCE_MARKER: {
            return Object.assign({}, state, {
                sourceMarkers: []
            })
        }
        case CLEAR_TARGET_MARKER: {
            return Object.assign({}, state, {
                targetMarkers: []
            })
        }

        default:
            return state;
    }
}
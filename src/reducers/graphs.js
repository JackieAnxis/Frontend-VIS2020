import { LASSO_DATA } from "../actions/wholeGraph"
import {
    ADD_SOURCE_MARKER,
    ADD_TARGET_MARKER,
    SET_SOURCE_MODIFED,
    SET_TARGET_GENERATED
} from "../actions/graphs"
import { CLEAR_SOURCE_MARKER } from "../actions/graphs"
import { CLEAR_TARGET_MARKER } from "../actions/graphs"

const initGraphs = {
    sourceMarkers: [],
    targetMarkers: [],
    source: null,
    target: null,
    source_modified: null,
    target_generated: null,
}

export function graphs(state = initGraphs, action) {
    switch (action.type) {
        case LASSO_DATA:
            if (action.lassoType === 'source') {
                return Object.assign({}, state, {
                    source: JSON.parse(JSON.stringify(action.data)),
                    sourceMarkers: [],
                    source_modified: null,
                    target: null,
                    targetMarkers: [],
                    target_generated: null,
                })
            } else if (action.lassoType === 'target') {
                return Object.assign({}, state, {
                    target: JSON.parse(JSON.stringify(action.data)),
                    targetMarkers: [],
                })
            }
        case SET_SOURCE_MODIFED:
            return Object.assign({}, state, {
                source_modified: action.data
            })

        case SET_TARGET_GENERATED:
            return Object.assign({}, state, {
                target_generated: action.data
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
            return state
    }
}
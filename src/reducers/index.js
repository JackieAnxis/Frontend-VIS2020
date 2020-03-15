import { combineReducers } from 'redux';
import { wholeGraph } from './wholeGraph';
import { exemplar } from './exemplar';
import { sketcher } from './sketcher';
import { suggestions } from './suggestions';
import { deformation } from './deformation';

import { GRAPH_MODIFIED, REQUEST_DATA, GOT_DATA, MODIFY_GRAPH, GOT_COMPUTE_RESULT } from '../actions';

const initTestGraphs = {
    source: null,
    target: null,
    source_modified: null,
    target_generated: null,
};

function testGraphs(state = initTestGraphs, action) {
    switch (action.type) {
        case GOT_DATA:
            return action.data;
            // return Object.assign({}, state, {
            // testData: action.data
            // })
        case GOT_COMPUTE_RESULT:
            return Object.assign({}, state, {
                target_generated: action.data.target_generated
            })
    }
    return state;
}

const initModifiedGraph = {
    source: null,
    target: null,
    source_modified: null,
    target_generated: null,
}

function modifiedGraphs(state = initModifiedGraph, action) {
    switch (action.type) {
        case MODIFY_GRAPH:
            return Object.assign({}, state, {
                [action.graphName]: action.data
            })
    }
    return state;
}

const rootReducer = combineReducers({
    testGraphs,
    modifiedGraphs,
    wholeGraph,
    exemplar,
    sketcher,
    suggestions,
    deformation
});


export default rootReducer;
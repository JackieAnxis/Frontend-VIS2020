import { combineReducers } from 'redux';
import { wholeGraph } from './wholeGraph'
import { graphs } from './graphs'

const rootReducer = combineReducers({
    graphs,
    wholeGraph,
});


export default rootReducer;
import { combineReducers } from 'redux';
import { wholeGraph } from './wholeGraph'
import { subGraph } from './subGraph'

const rootReducer = combineReducers({
    wholeGraph,
    subGraph
});


export default rootReducer;
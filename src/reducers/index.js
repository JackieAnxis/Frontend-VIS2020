import { combineReducers } from 'redux';
import { wholeGraph } from './wholeGraph'
import { subGraph } from './subGraph'
import { graphs } from './graphs'

const rootReducer = combineReducers({
    graphs,
    wholeGraph,
    subGraph
});


export default rootReducer;
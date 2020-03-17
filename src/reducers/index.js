import { combineReducers } from 'redux'
import { wholeGraph } from './wholeGraph'
import { subGraph } from './subGraph'
import { graphs } from './graphs'
import { suggestions } from './suggestions'


const rootReducer = combineReducers({
    graphs,
    wholeGraph,
    subGraph,
    suggestions
});


export default rootReducer;
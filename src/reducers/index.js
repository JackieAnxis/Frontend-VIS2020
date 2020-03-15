import { combineReducers } from 'redux';

function testReducers(state = null, action) {
    return state;
}

const rootReducer = combineReducers({
    testReducers,
});


export default rootReducer;
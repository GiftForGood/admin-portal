import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import sessionReducer from './src/components/session';

const initialState = {};

const rootReducer = combineReducers({
  session: sessionReducer,
});

const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));

export default store;

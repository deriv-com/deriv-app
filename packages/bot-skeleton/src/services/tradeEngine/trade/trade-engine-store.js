import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './state/reducers';

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;

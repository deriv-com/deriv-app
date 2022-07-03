import { combineReducers } from 'redux';
import single from './single';
import client from './client';

const rootReducer = combineReducers({ single, client });

export default rootReducer;

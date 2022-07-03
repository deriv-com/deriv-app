import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export * as constants from './constants';

export {
    clearProposals,
    openContractReceived,
    proposalsReady,
    purchaseSuccessful,
    start,
    sell,
    updateBalanceAction,
} from './actions';

export { $scope, initial_scope } from './scope';

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;

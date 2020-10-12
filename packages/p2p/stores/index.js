import React from 'react';
import GeneralStore from './general-store.js';
import BuySellStore from './buy-sell-store.js';

class RootStore {
    constructor() {
        this.general_store = new GeneralStore(this);
        this.buy_sell_store = new BuySellStore(this);
    }
}

let stores_context;

export const useStores = () => {
    if (!stores_context) {
        const root_store = new RootStore();
        stores_context = React.createContext({
            buy_sell_store: root_store.buy_sell_store,
            general_store: root_store.general_store,
        });
    }
    return React.useContext(stores_context);
};

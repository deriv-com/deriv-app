import React from 'react';
import GeneralStore from './general-store.js';

const stores_context = React.createContext({
    general_store: new GeneralStore(),
});

export const useStores = () => {
    return React.useContext(stores_context);
};

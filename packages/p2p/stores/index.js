import React from 'react';
import GeneralStore from '../stores/general-store';

const stores_context = React.createContext({
    general_store: new GeneralStore(),
});

export const useStores = () => {
    return React.useContext(stores_context);
};

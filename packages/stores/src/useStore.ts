import React, { useContext } from 'react';
import StoreContext from './storeContext';

const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error('useStore must be used within StoreContext');
    }

    return store;
};

export default useStore;

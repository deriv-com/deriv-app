import React from 'react';
import AdvertiserPageStore from './advertiser-page-store.js';
import GeneralStore from './general-store.js';
import MyProfileStore from './my-profile-store.js';

const stores_context = React.createContext({
    advertiser_page_store: new AdvertiserPageStore(),
    general_store: new GeneralStore(),
    my_profile_store: new MyProfileStore(),
});

export const useStores = () => {
    return React.useContext(stores_context);
};

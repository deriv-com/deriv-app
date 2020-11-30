import React from 'react';
import AdvertiserPageStore from './advertiser-page-store';
import GeneralStore from './general-store';
import MyProfileStore from './my-profile-store';
import SendbirdStore from './sendbird-store';

class RootStore {
    constructor() {
        this.general_store = new GeneralStore(this); // Leave at the top!
        this.advertiser_page_store = new AdvertiserPageStore(this);
        this.my_profile_store = new MyProfileStore(this);
        this.sendbird_store = new SendbirdStore(this);
    }
}

let stores_context;

export const useStores = () => {
    if (!stores_context) {
        const root_store = new RootStore();

        stores_context = React.createContext({
            general_store: root_store.general_store,
            advertiser_page_store: root_store.advertiser_page_store,
            my_profile_store: root_store.my_profile_store,
            sendbird_store: root_store.sendbird_store,
        });
    }
    return React.useContext(stores_context);
};

import React from 'react';
import GeneralStore from './general-store.js';
import AdvertiserPageStore from './advertiser-page-store.js';
import BuySellStore from './buy-sell-store.js';
import MyAdsStore from './my-ads-store.js';
import MyProfileStore from './my-profile-store.js';
import OrderStore from './order-store.js';
import OrderDetailsStore from './order-details-store.js';
class RootStore {
    constructor() {
        this.general_store = new GeneralStore(this); //Leave at the top!

        this.advertiser_page_store = new AdvertiserPageStore(this);
        this.buy_sell_store = new BuySellStore(this);
        this.my_ads_store = new MyAdsStore(this);
        this.my_profile_store = new MyProfileStore(this);
        this.order_store = new OrderStore(this);
        this.order_details_store = new OrderDetailsStore(this);
    }
}

let stores_context;

export const useStores = () => {
    if (!stores_context) {
        const root_store = new RootStore();
        stores_context = React.createContext({
            general_store: root_store.general_store,

            advertiser_page_store: root_store.advertiser_page_store,
            buy_sell_store: root_store.buy_sell_store,
            my_ads_store: root_store.my_ads_store,
            my_profile_store: root_store.my_profile_store,
            order_store: root_store.order_store,
            order_details_store: root_store.order_details_store,
        });
    }
    return React.useContext(stores_context);
};

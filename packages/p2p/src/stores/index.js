import React from 'react';
import GeneralStore from './general-store';
import AdvertiserPageStore from './advertiser-page-store';
import BuySellStore from './buy-sell-store';
import FloatingRateStore from './floating-rate-store';
import MyAdsStore from './my-ads-store';
import MyProfileStore from './my-profile-store';
import OrderStore from './order-store';
import OrderDetailsStore from './order-details-store';
import SendbirdStore from './sendbird-store';

export default class RootStore {
    constructor() {
        this.general_store = new GeneralStore(this); // Leave at the top!
        this.advertiser_page_store = new AdvertiserPageStore(this);
        this.buy_sell_store = new BuySellStore(this);
        this.floating_rate_store = new FloatingRateStore(this);
        this.my_ads_store = new MyAdsStore(this);
        this.my_profile_store = new MyProfileStore(this);
        this.order_store = new OrderStore(this);
        this.order_details_store = new OrderDetailsStore(this);
        this.sendbird_store = new SendbirdStore(this);
        this.floating_rate_store = new FloatingRateStore(this);
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
            sendbird_store: root_store.sendbird_store,
            floating_rate_store: root_store.floating_rate_store,
        });
    }
    return React.useContext(stores_context);
};

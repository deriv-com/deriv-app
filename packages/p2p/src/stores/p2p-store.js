import GeneralStore from './general-store';
import AdvertiserPageStore from './advertiser-page-store';
import BuySellStore from './buy-sell-store';
import FloatingRateStore from './floating-rate-store';
import MyAdsStore from './my-ads-store';
import MyProfileStore from './my-profile-store';
import OrderStore from './order-store';
import OrderDetailsStore from './order-details-store';
import SendbirdStore from './sendbird-store';

export default class P2PStore {
    constructor({ root_store }) {
        this.general_store = new GeneralStore({ root_store }); // Leave at the top!
        this.advertiser_page_store = new AdvertiserPageStore({ root_store });
        this.buy_sell_store = new BuySellStore({ root_store });
        this.floating_rate_store = new FloatingRateStore({ root_store });
        this.my_ads_store = new MyAdsStore({ root_store });
        this.my_profile_store = new MyProfileStore({ root_store });
        this.order_store = new OrderStore({ root_store });
        this.order_details_store = new OrderDetailsStore({ root_store });
        this.sendbird_store = new SendbirdStore({ root_store });
        this.floating_rate_store = new FloatingRateStore({ root_store });
    }
}

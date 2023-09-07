import React from 'react';
import { routes } from '@deriv/shared';
import { localize } from 'Components/i18next';
import AdvertiserPage from '../components/advertiser-page';
import BuySell from '../components/buy-sell';
import MyAds from '../components/my-ads';
import MyProfile from '../components/my-profile';
import Orders from '../components/orders';

// Error Routes
const Page404 = React.lazy(() => import(/* webpackChunkName: "404" */ '../components/page-404'));

// Order matters
const initRoutesConfig = () => {
    return [
        {
            path: routes.p2p_buy_sell,
            component: BuySell,
            getTitle: () => localize('Buy / Sell'),
            default: true,
        },
        {
            path: routes.p2p_advertiser_page,
            component: AdvertiserPage,
            getTitle: () => localize("Advertiser's page"),
        },
        {
            path: routes.p2p_orders,
            component: Orders,
            getTitle: () => localize('Orders'),
        },
        {
            path: routes.p2p_my_ads,
            component: MyAds,
            getTitle: () => localize('My ads'),
        },
        {
            path: routes.p2p_my_profile,
            component: MyProfile,
            getTitle: () => localize('My profile'),
        },
    ];
};

let routesConfig;

// For default page route if page/path is not found, must be kept at the end of routes_config array
const route_default = { path: routes.error404, component: Page404, getTitle: () => localize('Error 404') };

const getRoutesConfig = () => {
    if (!routesConfig) {
        routesConfig = initRoutesConfig();
        routesConfig.push(route_default);
    }
    return routesConfig;
};

export default getRoutesConfig;

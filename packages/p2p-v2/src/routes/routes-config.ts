import { lazy } from 'react';
import { ADVERTISER_URL, BUY_SELL_URL, MY_ADS_URL, MY_PROFILE_URL, ORDERS_URL } from '@/constants';

const BuySell = lazy(() => import('@/pages/buy-sell').then(module => ({ default: module.BuySell })));
const Orders = lazy(() => import('@/pages/orders').then(module => ({ default: module.Orders })));
const OrderDetails = lazy(() =>
    import('@/pages/orders/screens/OrderDetails').then(module => ({ default: module.OrderDetails }))
);
const MyAds = lazy(() => import('@/pages/my-ads').then(module => ({ default: module.MyAds })));
const CreateEditAd = lazy(() =>
    import('@/pages/my-ads/screens/CreateEditAd').then(module => ({ default: module.CreateEditAd }))
);
const MyProfile = lazy(() => import('@/pages/my-profile').then(module => ({ default: module.MyProfile })));
const Advertiser = lazy(() => import('@/pages/advertiser').then(module => ({ default: module.Advertiser })));

export const routes = [
    {
        component: BuySell,
        name: 'Buy/Sell',
        path: BUY_SELL_URL,
    },
    {
        component: Orders,
        name: 'Orders',
        path: ORDERS_URL,
        routes: [
            {
                component: OrderDetails,
                path: `${ORDERS_URL}/:orderId`,
            },
        ],
    },
    {
        component: MyAds,
        name: 'My Ads',
        path: MY_ADS_URL,
        routes: [
            {
                component: CreateEditAd,
                path: `${MY_ADS_URL}/create`,
            },
            {
                component: CreateEditAd,
                path: `${MY_ADS_URL}/edit`,
            },
        ],
    },
    {
        component: MyProfile,
        name: 'My Profile',
        path: MY_PROFILE_URL,
    },
    {
        component: Advertiser,
        name: 'Advertiser',
        path: `${ADVERTISER_URL}/:advertiserId`,
    },
];

import * as React from 'react';
import { localize } from '@deriv/translations';
import AboutUs from 'Components/pages/about-us';
import Home from 'Components/pages/home';
import Explore from 'Components/pages/explore';
import Resources from 'Components/pages/resources';
import DMT5Synthetic from 'Components/pages/platforms/dmt5_synthetic';
import { TRoutesProps, TRoute } from 'Types';

// 1. Order matters! Put more specific consumer_routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = ({ consumer_routes }: TRoutesConfig): TRoute[] => [
    {
        component: DMT5Synthetic,
        getTitle: () => localize('DMT5 Synthetic'),
        is_authenticated: false,
        path: consumer_routes.platform_dmt5_synthetic,
    },
    {
        component: Explore,
        getTitle: () => localize('Explore'),
        is_authenticated: false,
        path: consumer_routes.explore,
    },
    {
        component: AboutUs,
        getTitle: () => localize('About us'),
        is_authenticated: false,
        path: consumer_routes.about_us,
    },
    {
        component: Resources,
        getTitle: () => localize('Resources'),
        is_authenticated: false,
        path: consumer_routes.resources,
    },
    {
        component: Home,
        getTitle: () => localize('Dashboard'),
        is_authenticated: false,
        path: consumer_routes.home,
    },
    {
        icon: 'IcWalletWallets',
        label: localize('Wallets'),
        subroutes: [
            {
                label: localize('Credit/Debit Cards'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('E-wallet'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Cryptocurrency'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Bank Wire'),
                component: Explore,
                path: consumer_routes.explore,
            },
        ],
    },
    {
        icon: 'IcWalletPlatforms',
        label: localize('Platforms'),
        subroutes: [
            {
                label: localize('DMT5'),
                component: DMT5Synthetic,
                path: consumer_routes.platform_dmt5_synthetic,
            },
            {
                label: localize('DMT5 Financial'),
                component: DMT5Synthetic,
                path: consumer_routes.platform_dmt5_synthetic,
            },
            {
                label: localize('DMT5 Financial STP'),
                component: DMT5Synthetic,
                path: consumer_routes.platform_dmt5_synthetic,
            },
            {
                label: localize('DMT5 Synthetic'),
                component: DMT5Synthetic,
                path: consumer_routes.platform_dmt5_synthetic,
            },
            {
                label: localize('DTrader'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('DBot'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('SmartTrader'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Binary Bot'),
                component: Explore,
                path: consumer_routes.explore,
            },
        ],
    },
    {
        icon: 'IcWalletTradeTypes',
        label: localize('Trade Types'),
        subroutes: [
            {
                label: localize('CFDs'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Multipliers'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Options'),
                component: Explore,
                path: consumer_routes.explore,
            },
        ],
    },
    {
        icon: 'IcWalletMarkets',
        label: localize('Markets'),
        subroutes: [
            {
                label: localize('Forex'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Synthetic Indices'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Stock Indices'),
                component: Explore,
                path: consumer_routes.explore,
            },
            {
                label: localize('Commodities'),
                component: Explore,
                path: consumer_routes.explore,
            },
        ],
    },
    // It is possible to add a Deriv Crypto only path.
    // ...(is_deriv_crypto
    //     ? [
    //           {
    //               component: Home,
    //               getTitle: () => localize('Crypto-only path'),
    //               is_authenticated: false,
    //               path: consumer_routes.resources,
    //           },
    //       ]
    //     : []),
];

let routes_config: Array<TRoute>;

const getRoutesConfig = ({ consumer_routes, is_deriv_crypto, Page404 }: TRoutesConfig): TRoute[] => {
    // For default page route if page/path is not found, must be kept at the end of routes_config array.
    if (!routes_config) {
        const route_default = { component: Page404, getTitle: () => localize('Error 404') };

        routes_config = initRoutesConfig({ consumer_routes, is_deriv_crypto });
        routes_config.push(route_default);
    }

    return routes_config;
};

type TRoutesConfig = {
    Page404?: React.ElementType;
    consumer_routes: TRoutesProps;
    is_deriv_crypto: boolean;
};

export default getRoutesConfig;

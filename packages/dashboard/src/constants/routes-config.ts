import * as React from 'react';
import { localize } from '@deriv/translations';
import AboutUs from 'Components/pages/about-us';
import Home from 'Components/pages/home';
import Explore from 'Components/pages/explore';
import Resources from 'Components/pages/resources';
import { TRoutesProps, TRoute } from 'Types';

// import {
//     AboutUs,
//     Home,
//     Explore,
//     Resources,
//     DMT5,
//     DTrader,
//     SmartTrader,
//     BinaryBot,
//     CFDs,
//     Multipliers,
//     Options,
//     Forex,
//     SyntheticIndices,
//     StockIndices,
//     Commodities
// } from '../components/pages';

// 1. Order matters! Put more specific routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = ({ consumer_routes }: TRoutesConfig): TRoute[] => [
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
        path: consumer_routes.home,
        component: Home,
        // is_authenticated: true,
        getTitle: () => localize('Dashboard'),
        icon_component: 'IcUserOutline',
        routes: [
            {
                getTitle: () => localize('My Deriv'),
                icon: 'IcUserOutline',
            },
            {
                getTitle: () => localize('Discover'),
                icon: 'IcVerification',
            },
            {
                getTitle: () => localize('Platforms'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: consumer_routes.dmt5,
                        // component: DMT5,
                        component: AboutUs,
                        getTitle: () => localize('DMT5'),
                    },
                    {
                        path: consumer_routes.dtrader,
                        // component: DTrader,
                        component: AboutUs,
                        getTitle: () => localize('DTrader'),
                    },
                    {
                        path: consumer_routes.dbot,
                        // component: DBot,
                        component: AboutUs,
                        getTitle: () => localize('DBot'),
                    },
                    {
                        path: consumer_routes.smarttrader,
                        // component: SmartTrader,
                        component: AboutUs,
                        getTitle: () => localize('SmartTrader'),
                    },
                    {
                        path: consumer_routes.binary_bot,
                        // component: BinaryBot,
                        component: AboutUs,
                        getTitle: () => localize('Binary Bot'),
                    },
                ],
            },
            {
                getTitle: () => localize('Trade Types'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: consumer_routes.cfds,
                        // component: CFDs,
                        component: AboutUs,
                        getTitle: () => localize('CFDs'),
                    },
                    {
                        path: consumer_routes.multipliers,
                        // component: Multipliers,
                        component: AboutUs,
                        getTitle: () => localize('Multipliers'),
                    },
                    {
                        path: consumer_routes.options,
                        // component: Options,
                        component: AboutUs,
                        getTitle: () => localize('Options'),
                    },
                ],
            },
            {
                getTitle: () => localize('Markets'),
                icon: 'IcSecurity',
                subroutes: [
                    {
                        path: consumer_routes.forex,
                        // component: Forex,
                        component: AboutUs,
                        getTitle: () => localize('Forex'),
                    },
                    {
                        path: consumer_routes.synthetic_indices,
                        // component: SyntheticIndices,
                        component: AboutUs,
                        getTitle: () => localize('Synthetic Indices'),
                    },
                    {
                        path: consumer_routes.stock_indices,
                        // component: StockIndices,
                        component: AboutUs,
                        getTitle: () => localize('Stock Indices'),
                    },
                    {
                        path: consumer_routes.commodities,
                        // component: Commodities,
                        component: AboutUs,
                        getTitle: () => localize('Commodities'),
                    },
                ],
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
    //               path: routes.resources,
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

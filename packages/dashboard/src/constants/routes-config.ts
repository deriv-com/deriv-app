import * as React from 'react';
import { localize } from '@deriv/translations';
import AboutUs from 'Components/pages/about-us';
import Home from 'Components/pages/home';
import Explore from 'Components/pages/explore';
import Resources from 'Components/pages/resources';
import DMT5Synthetic from 'Components/pages/platforms/dmt5_synthetic';
import { TRoutesProps, TRoute } from 'Types';

// 1. Order matters! Put more specific routes at the top.
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
];

let routes_config: Array<TRoute>;

const getRoutesConfig = ({ consumer_routes, Page404 }: TRoutesConfig): TRoute[] => {
    // For default page route if page/path is not found, must be kept at the end of routes_config array.
    if (!routes_config) {
        const route_default = { component: Page404, getTitle: () => localize('Error 404') };

        routes_config = initRoutesConfig({ consumer_routes });
        routes_config.push(route_default);
    }

    return routes_config;
};

type TRoutesConfig = {
    Page404?: React.ElementType;
    consumer_routes: TRoutesProps;
};

export default getRoutesConfig;

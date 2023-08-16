import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { TRoute } from 'Types';
import Onboarding from 'Modules/onboarding';
import TradersHub from 'Modules/traders-hub';

// 1. Order matters! Put more specific consumer_routes at the top.
// 2. Don't use `Localize` component since native html tag like `option` cannot render them
const initRoutesConfig = (): TRoute[] => [
    {
        path: routes.traders_hub,
        component: TradersHub,
        is_authenticated: true,
        getTitle: () => localize('Traders Hub'),
    },
    {
        path: routes.onboarding,
        component: Onboarding,
        is_authenticated: false,
        getTitle: () => localize('Onboarding'),
    },
];

let routes_config: Array<TRoute>;

const getRoutesConfig = (): TRoute[] => {
    // For default page route if page/path is not found, must be kept at the end of routes_config array.
    if (!routes_config) {
        const route_default = { getTitle: () => localize('Error 404') };

        routes_config = initRoutesConfig();
        routes_config.push(route_default);
    }

    return routes_config;
};
export default getRoutesConfig;

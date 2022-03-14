import { routes } from '../routes';

// TODO: This should be moved to PlatformContext
export const platforms = {
    p2p: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'Deriv P2P',
        route_to_path: routes.cashier_p2p,
        url: 'https://app.deriv.com/cashier/p2p',
    },
    derivgo: {
        icon_text: undefined,
        is_hard_redirect: false,
        platform_name: 'Deriv Go',
        route_to_path: '',
        url: '',
    },
};

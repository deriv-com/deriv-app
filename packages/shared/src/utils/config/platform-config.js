import { routes } from '../routes';

export const platforms = {
    p2p: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'DP2P', // TODO: Change to Deriv P2P when renaming.
        route_to_path: routes.cashier_p2p,
        url: 'https://app.deriv.com/cashier/p2p',
    },
};

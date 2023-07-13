import { routes } from '../routes';

type TPlatform = {
    icon_text?: string;
    is_hard_redirect: boolean;
    platform_name: string;
    route_to_path: string;
    url: string;
};

type TPlatforms = Record<'p2p' | 'derivgo', TPlatform>;

// TODO: This should be moved to PlatformContext
export const platforms: TPlatforms = {
    p2p: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'Deriv P2P',
        route_to_path: routes.cashier_p2p,
        url: 'https://app.deriv.com/cashier/p2p',
    },
    derivgo: {
        icon_text: undefined,
        is_hard_redirect: true,
        platform_name: 'Deriv GO',
        route_to_path: '',
        url: 'https://app.deriv.com/redirect/derivgo',
    },
};

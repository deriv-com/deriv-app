import React from 'react';
import { getInitialLanguage } from '@deriv/translations';
import i18n from 'i18next';
import { initMoment } from '../date';
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

export const useOnLoadTranslation = () => {
    const [is_loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!i18n.language) {
            i18n.language = getInitialLanguage();
        }
        const is_english = i18n.language === 'EN';

        if (is_english) {
            setLoaded(true);
        } else {
            i18n.store.on('added', () => {
                setLoaded(true);
            });
        }

        return () => i18n.store.off('added');
    }, []);

    initMoment(i18n.language);
    return [is_loaded, setLoaded];
};

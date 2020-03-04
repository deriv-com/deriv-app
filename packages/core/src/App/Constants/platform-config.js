import { localize } from '@deriv/translations';
import { routes } from 'Constants/index';
import { isDesktop } from '@deriv/shared/utils/screen';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: localize('DTrader'),
        description: localize('Start trading now with a powerful, yet easy-to-use platform.'),
        link_to: routes.trade,
    },
    // TODO: remove isDesktop() when Dbot is supported in mobile
    isDesktop()
        ? {
              icon: 'IcBrandDbot',
              title: localize('DBot'),
              description: localize('Automate your trading ideas without coding.'),
              link_to: routes.bot,
          }
        : undefined,
    {
        icon: 'IcBrandDmt5',
        title: localize('DMT5'),
        description: localize('Trade with the platform of choice for professionals.'),
        link_to: routes.mt5,
    },
];

export default platform_config.filter(config => !!config); // filter undefined

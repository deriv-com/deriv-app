import { localize } from '@deriv/translations';
import { routes } from 'Constants/index';
import { isDesktop } from '@deriv/shared/utils/screen';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: localize('DTrader'),
        description: localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    // TODO: remove isDesktop() when Dbot and SmartTrader are supported in mobile
    isDesktop()
        ? {
              icon: 'IcBrandDbot',
              title: localize('DBot'),
              description: localize('Automated trading at your fingertips. No coding needed.'),
              link_to: routes.bot,
          }
        : undefined,
    {
        icon: 'IcBrandDmt5',
        title: localize('DMT5'),
        description: localize('The platform of choice for professionals worldwide.'),
        link_to: routes.mt5,
    },
    {
        icon: 'IcBrandSmarttrader',
        title: localize('SmartTrader'),
        description: localize('Trade the world’s markets with our popular user-friendly platform'),
        href: routes.smarttrader,
    },
];

export default platform_config.filter(config => !!config); // filter undefined

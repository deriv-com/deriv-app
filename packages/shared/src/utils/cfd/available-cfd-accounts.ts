import { localize } from '@deriv/translations';

import { CFD_PLATFORMS } from '../platform';

export interface AvailableAccount {
    name: string;
    description?: string;
    is_visible?: boolean;
    is_disabled?: boolean;
    platform?: string;
    market_type?: 'all' | 'financial' | 'synthetic';
    icon: string;
    availability: string;
    link_to?: string;
}

export const getCFDAvailableAccount = () => [
    {
        name: 'Derived',
        description: localize('CFDs on derived instruments.'),
        platform: CFD_PLATFORMS.MT5,
        market_type: 'synthetic',
        icon: 'Derived',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv X',
        description: localize('CFDs on financial and derived instruments via a customisable platform.'),
        platform: CFD_PLATFORMS.DXTRADE,
        market_type: 'all',
        icon: 'DerivX',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv cTrader',
        description: localize('CFDs on financial and derived instruments with copy trading.'),
        platform: CFD_PLATFORMS.CTRADER,
        market_type: 'all',
        icon: 'CTrader',
        availability: 'Non-EU',
    },
];

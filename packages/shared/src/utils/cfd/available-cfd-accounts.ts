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
        description: localize('This account offers CFDs on derived instruments.'),
        platform: CFD_PLATFORMS.MT5,
        market_type: 'synthetic',
        icon: 'Derived',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv X',
        description: localize('This account offers CFDs on a highly customisable CFD trading platform.'),
        platform: CFD_PLATFORMS.DXTRADE,
        market_type: 'all',
        icon: 'DerivX',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv cTrader',
        description: localize('This account offers CFDs on a feature-rich trading platform.'),
        platform: CFD_PLATFORMS.CTRADER,
        market_type: 'all',
        icon: 'CTrader',
        availability: 'Non-EU',
    },
];

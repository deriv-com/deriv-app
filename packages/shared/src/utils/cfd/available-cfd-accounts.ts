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

export const available_traders_hub_cfd_accounts: AvailableAccount[] = [
    {
        name: 'Derived',
        description: localize(
            'Trade CFDs on Deriv MT5 with Derived indices that simulate real-world market movements.'
        ),
        platform: CFD_PLATFORMS.MT5,
        market_type: 'synthetic',
        icon: 'Derived',
        availability: 'Non-EU',
    },
    {
        name: 'Deriv X',
        description: localize(
            'Trade CFDs on Deriv X with Derived indices, forex, stocks & indices, commodities and cryptocurrencies.'
        ),
        platform: CFD_PLATFORMS.DXTRADE,
        market_type: 'all',
        icon: 'DerivX',
        availability: 'Non-EU',
    },
];

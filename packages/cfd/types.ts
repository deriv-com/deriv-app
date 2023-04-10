import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import type { TStores } from '@deriv/stores';

export type TNewDetailsOfEachMT5Loginid = Required<
    Omit<DetailsOfEachMT5Loginid, 'market_type'> & { market_type?: 'financial' | 'synthetic' | 'all' }
>;

export type TTradingPlatformAvailableAccount = TStores['client']['trading_platform_available_accounts'][number];

import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import type { TCoreStores } from '@deriv/stores/types';

export type TNewDetailsOfEachMT5Loginid = Required<
    Omit<DetailsOfEachMT5Loginid, 'market_type'> & { market_type?: 'financial' | 'synthetic' | 'all' }
>;

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

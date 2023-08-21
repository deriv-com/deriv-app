import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Jurisdiction } from '@deriv/shared';
import type { TCoreStores } from '@deriv/stores/types';

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TWebSocket = {
    mt5LoginList: () => Promise<{
        mt5_login_list: DetailsOfEachMT5Loginid[];
    }>;
    storage: {
        mt5LoginList: () => Promise<{
            mt5_login_list: DetailsOfEachMT5Loginid[];
        }>;
    };
    tradingPlatformAccountsList: (platform: string) => Promise<{
        trading_platform_accounts: (DetailsOfEachMT5Loginid & { account_id: string })[];
    }>;
};

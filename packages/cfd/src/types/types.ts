import { Jurisdiction } from '@deriv/shared';
import type { TCoreStores } from '@deriv/stores/types';

export type TMobilePlatforms = 'ios' | 'android' | 'huawei';

export type TCFDPlatform = 'dxtrade' | 'mt5' | 'ctrader' | 'derivez';

export type TCFDsPlatformType = 'dxtrade' | 'derivez' | 'mt5' | 'ctrader' | '';

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

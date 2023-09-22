import { Jurisdiction } from '@deriv/shared';
import type { TCoreStores } from '@deriv/stores/types';

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

import { Jurisdiction } from '@deriv-lib/shared';
import type { TCoreStores } from '@deriv-lib/stores/types';

export type TTradingPlatformAvailableAccount = TCoreStores['client']['trading_platform_available_accounts'][number];

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

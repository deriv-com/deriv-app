/* eslint-disable camelcase */
/* 
    TODO: Remove these types once API types for client_kyc_status is available for mt5_login_list and trading_platform_available_accounts from BE
*/
import { THooks } from '../../types';

type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

export type TModifiedMT5Account = THooks.SortedMT5Accounts & {
    client_kyc_status: {
        poa_status: TStatuses;
        poi_status: TStatuses;
        valid_tin: 0 | 1;
    };
    licence_number: string;
    regulatory_authority: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectWithKeyInUnion<T, K extends keyof any> = T extends any ? (K extends keyof T ? T : never) : never;

export type TAvailableMT5Account = ObjectWithKeyInUnion<TModifiedMT5Account, 'shortcode'>;
export type TAddedMT5Account = ObjectWithKeyInUnion<TModifiedMT5Account, 'landing_company_short'>;

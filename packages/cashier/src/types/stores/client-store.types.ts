import { GetAccountStatus } from '@deriv/api-types';

export type TClientStore = {
    account_status: GetAccountStatus;
    balance?: string;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    is_logging_in: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    residence: string;
    verification_code: {
        payment_withdraw: string;
    };
};

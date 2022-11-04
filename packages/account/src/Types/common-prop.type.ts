/** Add types that are shared between components */

import { Authorize } from '@deriv/api-types';
import { Requireable, InferProps } from 'prop-types';

export type TToken = {
    display_name: string;
    last_used: string;
    scopes: string[];
    token: string;
};

export type TPoaStatusProps = {
    needs_poi: boolean;
    is_description_enabled?: boolean;
};

export type TAuthAccountInfo = NonNullable<Authorize['account_list']>[0] & {
    landing_company_shortcode?: string;
};

export type TPlatformContext = {
    is_appstore?: boolean;
};

export type TCurrencyConfig = {
    fractional_digits: number;
    is_deposit_suspended: 0 | 1;
    is_suspended: 0 | 1;
    is_withdrawal_suspended: 0 | 1;
    name: string;
    stake_default: number;
    transfer_between_accounts: {
        fees: {
            [key: string]: number;
        };
        limits: {
            max: number;
            min: number;
        } | null;
    };
    type: 'fiat' | 'crypto';
    value: string;
};

export type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

export type TRealAccount = {
    active_modal_index: number;
    current_currency: string;
    error_message: string;
    previous_currency: string;
    success_message: string;
    error_code: number;
};

export type TApiContext = {
    api_tokens: NonNullable<TToken[]> | undefined;
    deleteToken: (token: string) => Promise<void>;
    footer_ref: Element | DocumentFragment | undefined;
    overlay_ref:
        | ((...args: unknown[]) => unknown)
        | InferProps<{
              current: Requireable<unknown>;
          }>;
    toggleOverlay: () => void;
};

export type TPopoverAlignment = 'top' | 'right' | 'bottom' | 'left';

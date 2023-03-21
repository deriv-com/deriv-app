import { PaymentagentList } from '@deriv/api-types';

export type TPaymentAgent = PaymentagentList['list'][0] & {
    supported_banks?: { payment_method: string }[];
    currency?: string;
    value?: string;
};

import { PaymentAgentListResponse, PaymentagentList } from '@deriv/api-types';

type TPhoneNumber = {
    phone_number: string;
};

type TPaymentMethod = {
    payment_method: string;
};

type TUrl = {
    url: string;
};

export type TAgent = {
    email?: string;
    max_withdrawal?: string | null;
    min_withdrawal?: string | null;
    phone_numbers?: TPhoneNumber[];
    text?: string;
    url?: TUrl[];
    value?: string;
};

export type TPaymentAgentWithdrawConfirm = {
    amount?: number;
    client_id?: string;
    client_name?: string;
    currency?: string;
    description?: string;
    loginid?: string;
    payment_agent_name?: string;
};

export type TPaymentAgentWithdrawReceipt = {
    amount_transferred?: string;
    payment_agent_email?: string;
    payment_agent_id?: string;
    payment_agent_name?: string;
    payment_agent_phone?: TPhoneNumber[];
    payment_agent_url?: TUrl[];
};

export type TPartialPaymentAgentList = {
    currency?: string;
    deposit_commission?: string;
    email?: string;
    further_information?: string;
    max_withdrawal?: string | null;
    min_withdrawal?: string | null;
    name?: string;
    paymentagent_loginid?: string;
    phone_numbers?: TPhoneNumber[];
    supported_banks?: TPaymentMethod[];
    urls?: TUrl[];
    withdrawal_commission?: string;
};

export type TSupportedBank = {
    text: string;
    value: string;
};

export type TPaymentAgentWithdrawRequest = {
    amount: number;
    currency: string;
    dry_run?: number;
    loginid: string;
    verification_code: string;
};

type TExtendedPaymentAgentFields = {
    phone_numbers: TPhoneNumber[];
    supported_payment_methods: TPaymentMethod[];
    urls: TUrl[];
};

export type TExtendedPaymentAgentList = (PaymentagentList['list'][0] & TExtendedPaymentAgentFields)[];

export type TPaymentAgent = TExtendedPaymentAgentList[0];

interface TExtendedPaymentagentList extends PaymentagentList {
    list: TExtendedPaymentAgentList;
}

export interface TExtendedPaymentAgentListResponse extends PaymentAgentListResponse {
    paymentagent_list?: TExtendedPaymentagentList;
}

import { MutableRefObject } from 'react';
import { PaymentagentList } from '@deriv/api-types';

export type TOnRampProviderDetails = {
    icon: {
        dark: string;
        light: string;
    };
    name: string;
    getDescription: () => string;
    getAllowedResidencies: () => string[];
    getPaymentIcons: () => {
        dark: string;
        light: string;
    }[];
    getScriptDependencies: () => any[];
    getDefaultFromCurrency: () => string;
    getFromCurrencies: () => string[];
    getToCurrencies: () => string[];
    getWidgetHtml: () => Promise<any>;
    onMountWidgetContainer: (ref?: MutableRefObject<any>) => void;
    should_show_deposit_address: boolean;
};

export type TPaymentAgentDetails = PaymentagentList['list'][0] & {
    supported_banks?: { payment_method: string }[];
    currency?: string;
    value?: string;
};

export type TProviderDetailsWithoutFrom = Omit<TOnRampProviderDetails, 'getDefaultFromCurrency' | 'getFromCurrencies'>;

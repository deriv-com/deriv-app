import { MutableRefObject } from 'react';

export type TOnRampProvider = {
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
    getScriptDependencies: () => string[];
    getDefaultFromCurrency?: () => string;
    getFromCurrencies?: () => string[];
    getToCurrencies: () => string[];
    getWidgetHtml: () => Promise<unknown>;
    onMountWidgetContainer: (ref?: MutableRefObject<unknown>) => void;
    should_show_deposit_address: boolean;
};

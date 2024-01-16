import { p2p } from '@deriv/api';

export type TAdvertiserPaymentMethods = ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data'];
export type TPaymentMethodFormConfig = {
    isVisible: boolean;
    paymentMethod?: DeepPartial<NonNullable<TAdvertiserPaymentMethods>[number]>;
    title: string;
    type: 'ADD' | 'EDIT';
};
export type TSelectedPaymentMethod = {
    displayName: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['display_name'];
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
};
export type TPaymentMethodFotmValues = {
    paymentMethodId: string;
    type: 'ADD' | 'EDIT';
    values: {
        [key: string]: string;
        method: string;
    };
};
export type TGenericSizes = '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

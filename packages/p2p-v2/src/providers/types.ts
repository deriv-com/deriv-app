import { TAdvertiserPaymentMethods } from 'types';
import { p2p } from '@deriv/api';

export type TAdvertiserPaymentMethodsConfig = {
    formState?: {
        actionType?: 'ADD' | 'DELETE' | 'EDIT' | 'RESET';
        isVisible?: boolean;
        paymentMethod?: DeepPartial<NonNullable<TAdvertiserPaymentMethods>[number]>;
        title?: string;
    };
};

type TSelectedPaymentMethod = Partial<{
    displayName: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['display_name'];
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    id: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['id'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
}>;

export type TReducerAction = {
    payload?: {
        formState?: TAdvertiserPaymentMethodsConfig['formState'];
        paymentMethod?: DeepPartial<TSelectedPaymentMethod>;
    };
    type?: NonNullable<TAdvertiserPaymentMethodsConfig['formState']>['actionType'];
};

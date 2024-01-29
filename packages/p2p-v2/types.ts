import { p2p } from '@deriv/api';

export type TAdvertiserPaymentMethods = ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['display_name'];
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    id: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['id'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
}>;

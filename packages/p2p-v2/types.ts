/* eslint-disable camelcase */
import { p2p } from '@deriv/api';

declare global {
    interface WindowEventMap {
        queryChange: CustomEvent;
        switchTab: CustomEvent & {
            detail: {
                tab: 'buy-sell' | 'my-ads' | 'my-profile' | 'orders';
            };
        };
    }
}

export type TAdvertiserPaymentMethods = ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['display_name'];
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    id: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['id'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
}>;

export type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default: 1 | undefined;
    text: string;
    value: string;
};

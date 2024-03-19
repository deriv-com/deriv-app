/* eslint-disable camelcase */
import { useAdvertiserStats } from '@/hooks';
import { p2p, useServerTime } from '@deriv/api-v2';

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
export type TPaymentMethods = ReturnType<typeof p2p.paymentMethods.useGet>['data'];
export type TAccumulatedPaymentMethods = Record<
    string,
    NonNullable<TAdvertiserPaymentMethods | TPaymentMethods>[number]
>;
export type TPaymentMethod = NonNullable<TAdvertiserPaymentMethods>[number] | NonNullable<TPaymentMethods>[number];

export type TAdvertiserStats = ReturnType<typeof useAdvertiserStats>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: string;
    fields: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['fields'];
    id: NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>[number]['id'];
    method: NonNullable<TAdvertiserPaymentMethods>[number]['method'];
}>;

export type TAdvertsTableRowRenderer = Partial<NonNullable<ReturnType<typeof p2p.advert.useGetList>['data']>[0]>;

type NonUndefinedValues<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};

type TAdvertData = NonNullable<ReturnType<typeof p2p.advert.useGet>['data']>;

export type TAdvertType = NonUndefinedValues<TAdvertData>;

export type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default?: 1;
    text: string;
    value: string;
};

export type TServerTime = ReturnType<typeof useServerTime>['data'];

export type TOrders = NonNullable<ReturnType<typeof p2p.order.useGetList>['data']>;

const prefix = '/cashier/p2p-v2';

export type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace THooks {
    // eslint-disable-next-line  @typescript-eslint/no-namespace
    export namespace Advert {
        export type Get = ReturnType<typeof p2p.advert.useGet>['data'];
        export type GetList = ReturnType<typeof p2p.advert.useGetList>['data'];
        export type Create = ReturnType<typeof p2p.advert.useCreate>['data'];
        export type Update = ReturnType<typeof p2p.advert.useUpdate>['data'];
        export type Delete = ReturnType<typeof p2p.advert.useDelete>['data'];
    }
    // eslint-disable-next-line  @typescript-eslint/no-namespace
    export namespace Advertiser {
        export type GetInfo = ReturnType<typeof p2p.advertiser.useGetInfo>['data'];
        export type GetList = ReturnType<typeof p2p.advertiser.useGetList>['data'];
        export type Create = ReturnType<typeof p2p.advertiser.useCreate>['data'];
        export type Update = ReturnType<typeof p2p.advertiser.useUpdate>['data'];
    }
}

// export * from './advert';
// export * from './advertiser';
// export * from './counterparty';
// export * from './order-dispute';
// export * from './order';
// export * from './payment-method';
// export * from './settings';

// export * as advert from './p2p-advert';
// export * as advertiserAdverts from './p2p-advertiser-adverts';

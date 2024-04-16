/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
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

export type TAccumulatedPaymentMethods = Record<
    string,
    (THooks.AdvertiserPaymentMethods.Get | THooks.PaymentMethods.Get)[number]
>;
export type TPaymentMethod = THooks.AdvertiserPaymentMethods.Get[number] | THooks.PaymentMethods.Get[number];

export type TAdvertiserStats = ReturnType<typeof useAdvertiserStats>['data'];

export type TSelectedPaymentMethod = Partial<{
    displayName: string;
    fields: THooks.PaymentMethods.Get[number]['fields'];
    id: THooks.PaymentMethods.Get[number]['id'];
    method: THooks.AdvertiserPaymentMethods.Get[number]['method'];
}>;

export type TAdvertsTableRowRenderer = Partial<THooks.Advert.GetList[number]>;

type NonUndefinedValues<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};

export type TAdvertType = NonUndefinedValues<THooks.Advert.Get>;

export type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default?: 1;
    text: string;
    value: string;
};

export type TServerTime = ReturnType<typeof useServerTime>['data'];

const prefix = '/cashier/p2p-v2';

export type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

export namespace THooks {
    export namespace AdvertiserAdverts {
        export type Get = NonNullable<ReturnType<typeof p2p.advertiserAdverts.useGet>['data']>;
    }
    export namespace Advert {
        export type Get = NonNullable<ReturnType<typeof p2p.advert.useGet>['data']>;
        export type GetList = NonNullable<ReturnType<typeof p2p.advert.useGetList>['data']>;
        export type Create = NonNullable<ReturnType<typeof p2p.advert.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof p2p.advert.useUpdate>['data']>;
        export type Delete = NonNullable<ReturnType<typeof p2p.advert.useDelete>['data']>;
    }
    export namespace Advertiser {
        export type GetInfo = NonNullable<ReturnType<typeof p2p.advertiser.useGetInfo>['data']>;
        export type GetList = NonNullable<ReturnType<typeof p2p.advertiser.useGetList>['data']>;
        export type Create = NonNullable<ReturnType<typeof p2p.advertiser.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof p2p.advertiser.useUpdate>['data']>;
    }
    export namespace Counterparty {
        export type Get = NonNullable<ReturnType<typeof p2p.counterparty.useGet>['data']>;
        export type Block = NonNullable<ReturnType<typeof p2p.counterparty.useBlock>['data']>;
        export type Unblock = NonNullable<ReturnType<typeof p2p.counterparty.useUnblock>['data']>;
    }
    export namespace OrderDispute {
        export type Dispute = NonNullable<ReturnType<typeof p2p.orderDispute.useDispute>['data']>;
    }
    export namespace Order {
        export type Cancel = NonNullable<ReturnType<typeof p2p.order.useCancel>['data']>;
        export type Confirm = NonNullable<ReturnType<typeof p2p.order.useConfirm>['data']>;
        export type Create = NonNullable<ReturnType<typeof p2p.order.useCreate>['data']>;
        export type Get = NonNullable<ReturnType<typeof p2p.order.useGet>['data']>;
        export type GetList = NonNullable<ReturnType<typeof p2p.order.useGetList>['data']>;
    }
    export namespace PaymentMethods {
        export type Get = NonNullable<ReturnType<typeof p2p.paymentMethods.useGet>['data']>;
    }
    export namespace AdvertiserPaymentMethods {
        export type Get = NonNullable<ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data']>;
        export type Create = NonNullable<ReturnType<typeof p2p.advertiserPaymentMethods.useCreate>['data']>;
        export type Update = NonNullable<ReturnType<typeof p2p.advertiserPaymentMethods.useUpdate>['data']>;
        export type Delete = NonNullable<ReturnType<typeof p2p.advertiserPaymentMethods.useDelete>['data']>;
    }
    export namespace Settings {
        export type Get = NonNullable<ReturnType<typeof p2p.settings.useGetSettings>['data']>;
    }
    export namespace Country {
        export type Get = NonNullable<ReturnType<typeof p2p.countryList.useGet>['data']>;
    }
}
export type TOrders = NonNullable<ReturnType<typeof p2p.order.useGetList>['data']>;

export type TStep = {
    header: {
        title: string;
    };
    subStepCount?: number;
};

export type TCountryListItem = THooks.Country.Get;

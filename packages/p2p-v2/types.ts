import { p2p } from '@deriv/api';

export type TAdvertiserPaymentMethods = ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data'];

export type TGenericSizes = '2xl' | '2xs' | '3xl' | '3xs' | '4xl' | '5xl' | '6xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

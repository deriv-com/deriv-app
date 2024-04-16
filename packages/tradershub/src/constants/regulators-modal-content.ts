/* eslint-disable sort-keys */
import { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui';

export type TRowItem = {
    options?: {
        align?: ComponentProps<typeof Text>['align'];
        color?: ComponentProps<typeof Text>['color'];
        shouldShowAsteriskAtEnd?: boolean;
        weight?: ComponentProps<typeof Text>['weight'];
    };
    text: string;
};

type TRegulatorContent = Record<string, TRowItem | TRowItem[]>;

export type TRegulatorsContentProps = {
    attribute: string;
    content: TRegulatorContent;
    id: string;
};

export const getCFDContents: TRegulatorsContentProps[] = [
    {
        attribute: 'CFDs',
        content: {
            euRegulator: { text: 'Yes' },
            nonEuRegulator: { text: 'Yes' },
        },
        id: 'cfds',
    },
    {
        attribute: 'Regulators/external dispute resolution',
        content: {
            euRegulator: { text: 'Malta Financial Services Authority' },
            nonEuRegulator: [
                { text: 'Financial Commission' },
                { text: 'British Virgin Islands Financial Services Commission' },
                { text: 'Vanuatu Financial Services Commission' },
                { text: 'Labuan Financial Services Authority' },
            ],
        },
        id: 'regulators',
    },
    {
        attribute: 'Counterparty company',
        content: {
            euRegulator: { text: 'Deriv Investments (Europe) Limited' },
            nonEuRegulator: [
                { text: 'Deriv (SVG) LLC' },
                { text: 'Deriv (BVI) Ltd' },
                { text: 'Deriv (V) Ltd' },
                { text: 'Deriv (FX) Ltd' },
            ],
        },
        id: 'counterparty_company',
    },
    {
        attribute: 'Negative balance protection',
        content: {
            euRegulator: { text: 'All assets' },
            nonEuRegulator: { text: 'Synthetics only' },
        },
        id: 'negative_balance_protection',
    },
    {
        attribute: 'Leverage',
        content: {
            euRegulator: { text: '30' },
            nonEuRegulator: { text: '100-20' },
        },
        id: 'leverage',
    },
    {
        attribute: 'Assets',
        content: {
            euRegulator: [
                { options: { shouldShowAsteriskAtEnd: true }, text: 'Synthetics' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Boom 300 and Crash 300 Index',
                },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Volatility 150 Index and Volatility 250 Index',
                },
            ],
            nonEuRegulator: [
                { text: 'Synthetics' },
                { text: 'Baskets' },
                { text: 'Derived FX' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
            ],
        },
        id: 'assets',
    },
    {
        attribute: 'Platform',
        content: {
            euRegulator: { text: 'Deriv MT5' },
            nonEuRegulator: { text: 'Deriv MT5, Deriv X' },
        },
        id: 'platform',
    },
];

export const getOptionsContents: TRegulatorsContentProps[] = [
    {
        attribute: 'Options & Multipliers',
        content: {
            euRegulator: { options: { weight: 'bold' }, text: 'Multipliers only' },
            nonEuRegulator: { text: 'Yes' },
        },
        id: 'options',
    },
    {
        attribute: 'Regulators/external dispute resolution',
        content: {
            euRegulator: { text: 'Malta Financial Services Authority' },
            nonEuRegulator: { text: 'Financial Commission' },
        },
        id: 'regulator_in_options',
    },
    {
        attribute: 'Counterparty company',
        content: {
            euRegulator: { text: 'Deriv Investments (Europe) Limited' },
            nonEuRegulator: { text: 'Deriv (SVG) LLC' },
        },
        id: 'counterparty_company_in_options',
    },
    {
        attribute: 'Assets',
        content: {
            euRegulator: [
                {
                    options: { shouldShowAsteriskAtEnd: true },
                    text: 'Synthetics',
                },
                { text: 'Forex' },
                { text: 'Cryptocurrencies' },
                {
                    options: { color: 'error', weight: 'bold' },
                    text: '*Boom 300 and Crash 300 Index',
                },
            ],
            nonEuRegulator: [
                { text: 'Synthetics' },
                { text: 'Baskets' },
                { text: 'Forex' },
                { text: 'Stocks' },
                { text: 'Stock indices' },
                { text: 'Commodities' },
                { text: 'Cryptocurrencies' },
            ],
        },
        id: 'assets_in_options',
    },
    {
        attribute: 'Platform',
        content: {
            euRegulator: { text: 'DTrader' },
            nonEuRegulator: { text: 'DTrader, DBot, SmartTrader, and Binary Bot' },
        },
        id: 'platform_in_options',
    },
];

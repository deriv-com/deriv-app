import { localize } from '@deriv/translations';

export const mt5 = {
    synthetic: {
        title: localize('Deriv MT5 Synthetics'),
        description: localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.'),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('20+') },
    },
    financial: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade major (standard and micro-lots) and minor currency pairs, stocks, stock indices, commodities, and cryptocurrencies with high leverage.'
        ),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('150+') },
    },
    financial_eu: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade CFDs on forex, stocks, stock indices, synthetic indices, and commodities with leverage.'
        ),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('50+') },
    },
    financial_au: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade major (standard and micro-lots) and minor currency pairs, stocks, stock indices, commodities, and cryptocurrencies with high leverage.'
        ),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('100+') },
    },
    financial_stp: {
        title: localize('Deriv MT5 Financial STP'),
        description: localize(
            'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).'
        ),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:100') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('70+') },
    },
};

export const dxtrade = {
    synthetic: {
        title: localize('Deriv X Synthetics'),
        description: localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.'),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('20+') },
    },
    financial: {
        title: localize('Deriv X Financial'),
        description: localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.'),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
    financial_eu: {
        title: localize('Deriv X Financial'),
        description: localize('Trade forex, commodities and cryptocurrencies at high leverage.'),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
    financial_au: {
        title: localize('Deriv X Financial'),
        description: localize('Trade forex, commodities and cryptocurrencies at high leverage.'),
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
};

const cfdAccountDetails = {
    mt5,
    dxtrade,
};

export default cfdAccountDetails;

import { localize } from '@deriv/translations';

export const mt5 = {
    synthetic: {
        title: localize('Deriv MT5 Synthetics'),
        description: localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.'),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:1000') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('20+') },
    },
    financial: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade major (standard and micro-lots) and minor currency pairs, stocks, stock indices, commodities, and cryptocurrencies with high leverage.'
        ),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:1000') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('150+') },
    },
    financial_eu: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade CFDs on forex, stocks, stock indices, synthetic indices, and commodities with leverage.'
        ),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:30') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('50+') },
    },
    financial_au: {
        title: localize('Deriv MT5 Financial'),
        description: localize(
            'Trade major (standard and micro-lots) and minor currency pairs, stocks, stock indices, commodities, and cryptocurrencies with high leverage.'
        ),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:30') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('100+') },
    },
    financial_stp: {
        title: localize('Deriv MT5 Financial STP'),
        description: localize(
            'Trade popular currency pairs and cryptocurrencies with straight-through processing order (STP).'
        ),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:100') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('70+') },
    },
};

export const dxtrade = {
    synthetic: {
        title: localize('Deriv X Synthetics'),
        description: localize('Trade CFDs on our Synthetic Indices that simulate real-world market movement.'),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:1000') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('20+') },
    },
    financial: {
        title: localize('Deriv X Financial'),
        description: localize('Trade forex, commodities and cryptocurrencies at high leverage.'),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:1000') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('90+') },
    },
    financial_eu: {
        title: localize('Deriv X Financial'),
        description: localize('Trade forex, commodities and cryptocurrencies at high leverage.'),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:30') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('90+') },
    },
    financial_au: {
        title: localize('Deriv X Financial'),
        description: localize('Trade forex, commodities and cryptocurrencies at high leverage.'),
        leverage: { getKey: () => localize('Leverage'), getValue: () => localize('Up to 1:30') },
        'margin-call': { getKey: () => localize('Margin call'), getValue: () => localize('100%') },
        'stop-out-level': { getKey: () => localize('Stop out level'), getValue: () => localize('50%') },
        'number-of-assets': { getKey: () => localize('Number of assets'), getValue: () => localize('90+') },
    },
};

const cfd_account_details = {
    mt5,
    dxtrade,
};

export default cfd_account_details;

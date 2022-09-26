import { localize } from '@deriv/translations';

type TMT5 = {
    real_synthetic_specs: Record<string, { key: () => string; value: () => string }>;
    real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    eu_real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    real_financial_stp_specs: Record<string, { key: () => string; value: () => string }>;
    au_real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    demo_financial_stp_specs: Record<string, { key: () => string; value: () => string }>;
};

type TDXTrade = {
    demo_all_specs: Record<string, { key: () => string; value: () => string }>;
    real_synthetic_specs: Record<string, { key: () => string; value: () => string }>;
    real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    eu_real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    au_real_financial_specs: Record<string, { key: () => string; value: () => string }>;
    demo_financial_stp_specs?: Record<string, { key: () => string; value: () => string }>;
    real_financial_stp_specs?: Record<string, { key: () => string; value: () => string }>;
};

export type TSpecifications = {
    mt5: TMT5;
    dxtrade: TDXTrade;
};

const mt5 = {
    real_synthetic_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('20+') },
    },
    real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('150+') },
    },
    eu_real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('50+') },
    },
    real_financial_stp_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:100') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('70+') },
    },
    au_real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('100+') },
    },
    demo_financial_stp_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:100') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('70+') },
    },
};

// TODO: Edit this after real accounts release
const dxtrade = {
    demo_all_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('110+') },
    },
    real_synthetic_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('20+') },
    },
    real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:1000') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
    eu_real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
    au_real_financial_specs: {
        leverage: { key: () => localize('Leverage'), value: () => localize('Up to 1:30') },
        'margin-call': { key: () => localize('Margin call'), value: () => localize('100%') },
        'stop-out-level': { key: () => localize('Stop out level'), value: () => localize('50%') },
        'number-of-assets': { key: () => localize('Number of assets'), value: () => localize('90+') },
    },
};

const specifications = {
    mt5,
    dxtrade,
};

export default specifications;

import { localize } from '@deriv/translations';

type TMT5 = {
    real_synthetic_specs: Record<string, string>;
    real_financial_specs: Record<string, string>;
    eu_real_financial_specs: Record<string, string>;
    real_financial_stp_specs: Record<string, string>;
    au_real_financial_specs: Record<string, string>;
    demo_financial_stp_specs: Record<string, string>;
};

type TDXTrade = {
    real_synthetic_specs: Record<string, string>;
    real_financial_specs: Record<string, string>;
    eu_real_financial_specs: Record<string, string>;
    au_real_financial_specs: Record<string, string>;
    demo_financial_stp_specs?: Record<string, string>;
    real_financial_stp_specs?: Record<string, string>;
};

export type TSpecifications = {
    mt5: TMT5;
    dxtrade: TDXTrade;
};

const mt5 = {
    real_synthetic_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('20+'),
    },
    real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('150+'),
    },
    eu_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('50+'),
    },
    real_financial_stp_specs: {
        [localize('Leverage')]: localize('Up to 1:100'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('70+'),
    },
    au_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('100+'),
    },
    demo_financial_stp_specs: {
        [localize('Leverage')]: localize('Up to 1:100'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('70+'),
    },
};

const dxtrade = {
    real_synthetic_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('20+'),
    },
    real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('90+'),
    },
    eu_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('90+'),
    },
    au_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('90+'),
    },
};

const specifications = {
    mt5,
    dxtrade,
};

export default specifications;

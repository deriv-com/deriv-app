import { localize } from '@deriv/translations';

const mt5 = {
    real_synthetic_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('10+'),
    },
    real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:1000'),
        [localize('Margin call')]: localize('150%'),
        [localize('Stop out level')]: localize('75%'),
        [localize('Number of assets')]: localize('50+'),
    },
    eu_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('50+'),
    },
    real_financial_stp_specs: {
        [localize('Leverage')]: localize('Up to 1:100'),
        [localize('Margin call')]: localize('150%'),
        [localize('Stop out level')]: localize('75%'),
        [localize('Number of assets')]: localize('50+'),
    },
    au_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('100+'),
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
        [localize('Number of assets')]: localize('100+'),
    },
    eu_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('100+'),
    },
    au_real_financial_specs: {
        [localize('Leverage')]: localize('Up to 1:30'),
        [localize('Margin call')]: localize('100%'),
        [localize('Stop out level')]: localize('50%'),
        [localize('Number of assets')]: localize('100+'),
    },
};

const specifications = {
    mt5,
    dxtrade,
};

export default specifications;

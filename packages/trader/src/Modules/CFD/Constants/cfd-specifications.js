const mt5 = {
    real_synthetic_specs: {
        Leverage: 'Up to 1:1000',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '20+',
    },
    real_financial_specs: {
        Leverage: 'Up to 1:1000',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '150+',
    },
    eu_real_financial_specs: {
        Leverage: 'Up to 1:30',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '50+',
    },
    real_financial_stp_specs: {
        Leverage: 'Up to 1:100',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '70+',
    },
    au_real_financial_specs: {
        Leverage: 'Up to 1:30',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '100+',
    },
    demo_financial_stp_specs: {
        Leverage: 'Up to 1:100',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '70+',
    },
};

const dxtrade = {
    real_synthetic_specs: {
        Leverage: 'Up to 1:500',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '20+',
    },
    real_financial_specs: {
        Leverage: 'Up to 1:1000',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '90+',
    },
    eu_real_financial_specs: {
        Leverage: 'Up to 1:30',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '90+',
    },
    au_real_financial_specs: {
        Leverage: 'Up to 1:30',
        'Margin call': '100%',
        'Stop out level': '50%',
        'Number of assets': '90+',
    },
};

const specifications = {
    mt5,
    dxtrade,
};

export default specifications;

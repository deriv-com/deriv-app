import { localize } from '@deriv/translations';
import { TCompareAccountContentProps, TCompareAccountFooterButtonData } from '../Containers/props.types';

export const eu_real_content: TCompareAccountContentProps[] = [
    {
        id: 'platform',
        attribute: localize('Platform'),
        values: {
            financial_maltainvest: { text: localize('MT5'), options: { size: 'xxs' } },
        },
    },
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            financial_maltainvest: { text: localize('Malta'), options: { weight: 'bold' } },
        },
    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            financial_maltainvest: { text: localize('Deriv Investments (Europe) Limited') },
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulator'),
        values: {
            financial_maltainvest: {
                text: localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
                options: { styles: { padding: '1.8rem 0.8rem' } },
            },
        },
    },
    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            financial_maltainvest: { text: localize('Up to 1:30'), options: { size: 'xxxs' } },
        },
    },
    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            financial_maltainvest: [
                { text: localize('Synthetics'), options: { should_show_asterick_at_end: true } },
                { text: localize('Forex: standard') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
                {
                    text: localize('*Boom 300 and Crash 300 Index'),
                    options: { color: 'loss-danger', weight: 'bold', styles: { paddingTop: '2rem' } },
                },
            ],
        },
    },
];
export const cr_real_content: TCompareAccountContentProps[] = [
    {
        id: 'platform',
        attribute: localize('Platform'),
        values: {
            synthetic_svg: { text: localize('MT5') },
            derivx: { text: localize('Deriv X') },
        },
    },
    {
        id: 'jurisdiction',
        attribute: localize('Jurisdiction'),
        values: {
            synthetic_svg: { text: localize('St. Vincent & Grenadines'), options: { weight: 'bold' } },
            synthetic_bvi: { text: localize('British Virgin Islands'), options: { weight: 'bold' } },
            financial_svg: { text: localize('St. Vincent & Grenadines'), options: { weight: 'bold' } },
            financial_bvi: { text: localize('British Virgin Islands'), options: { weight: 'bold' } },
            financial_vanuatu: { text: localize('Vanuatu'), options: { weight: 'bold' } },
            financial_labuan: {
                text: localize('Labuan'),
                options: { weight: 'bold' },
                tooltip_msg: localize(
                    'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.'
                ),
            },
            derivx: { text: localize('St. Vincent & Grenadines'), options: { weight: 'bold' } },
        },
    },
    {
        id: 'counterparty',
        attribute: localize('Counterparty company'),
        values: {
            synthetic_svg: { text: localize('Deriv (SVG) LLC') },
            synthetic_bvi: { text: localize('Deriv (BVI) Ltd') },
            financial_svg: { text: localize('Deriv (SVG) LLC') },
            financial_bvi: { text: localize('Deriv (BVI) Ltd') },
            financial_vanuatu: { text: localize('Deriv (V) Ltd') },
            financial_labuan: { text: localize('Deriv (FX) Ltd') },
            derivx: { text: localize('Deriv (SVG) LLC') },
        },
    },
    {
        id: 'regulator',
        attribute: localize('Regulators/External dispute resolution'),
        values: {
            synthetic_svg: { text: localize('Financial Commission') },
            synthetic_bvi: {
                text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            },
            financial_svg: { text: localize('Financial Commission') },
            financial_bvi: {
                text: localize('British Virgin Islands Financial Services Commission (licence no. SIBA/L/18/1114)'),
            },
            financial_vanuatu: {
                text: localize('Vanuatu Financial Services Commission'),
            },
            financial_labuan: { text: localize('Labuan Financial Services Authority (Licence no. MB/18/0024)') },
            derivx: { text: 'Financial Commission' },
        },
    },
    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            synthetic_svg: { text: localize('Up to 1:1000') },
            synthetic_bvi: { text: localize('Up to 1:1000') },
            financial_vanuatu: { text: localize('Up to 1:1000') },
            financial_labuan: { text: localize('Up to 1:100') },
            derivx: { text: localize('Up to 1:1000') },
        },
    },
    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Derived FX') },
            ],
            financial_svg: [
                { text: localize('Forex: standard/micro') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
            financial_vanuatu: [
                { text: localize('Forex') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
            financial_labuan: [{ text: localize('Forex') }, { text: localize('Cryptocurrencies') }],
            derivx: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Forex: standard/micro') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
        },
    },
];

export const cr_real_footer_buttons: TCompareAccountFooterButtonData[] = [
    { label: localize('Add'), action: 'synthetic_svg' },
    { label: localize('Add'), action: 'synthetic_bvi' },
    { label: localize('Add'), action: 'financial_svg' },
    { label: localize('Add'), action: 'financial_bvi' },
    { label: localize('Add'), action: 'financial_vanuatu' },
    { label: localize('Add'), action: 'financial_labuan' },
    { label: localize('Add'), action: 'derivx' },
];
export const eu_real_footer_button: TCompareAccountFooterButtonData[] = [
    { label: localize('Add'), action: 'financial_maltainvest' },
];

export const eu_demo_footer_button: TCompareAccountFooterButtonData[] = [
    { label: localize('Add'), action: 'financial_maltainvest' },
];

export const preappstore_cr_demo_content: TCompareAccountContentProps[] = [
    {
        id: 'platform',
        attribute: localize('Platform'),
        values: {
            synthetic_svg: { text: localize('MT5') },
            financial_svg: { text: localize('MT5') },
            derivx: { text: localize('Deriv X') },
        },
    },
    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            synthetic_svg: { text: localize('Up to 1:1000') },
            financial_svg: { text: localize('Up to 1:1000') },
            derivx: { text: localize('Up to 1:1000') },
        },
    },
    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            synthetic_svg: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Derived FX') },
            ],
            financial_svg: [
                { text: localize('Forex: standard/micro') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
            derivx: [
                { text: localize('Synthetics') },
                { text: localize('Baskets') },
                { text: localize('Derived FX') },
                { text: localize('Forex: standard/micro') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
            ],
        },
    },
];

export const preappstore_cr_demo_footer_buttons: TCompareAccountFooterButtonData[] = [
    { label: localize('Add'), action: 'synthetic_svg' },
    { label: localize('Add'), action: 'financial_svg' },
    { label: localize('Add'), action: 'derivx' },
];

export const preppstore_eu_demo_content: TCompareAccountContentProps[] = [
    {
        id: 'leverage',
        attribute: localize('Maximum leverage'),
        values: {
            financial_maltainvest: { text: localize('Up to 1:30'), options: { size: 'xxxs' } },
        },
    },
    {
        id: 'instruments',
        attribute: localize('Trading instruments'),
        values: {
            financial_maltainvest: [
                { text: localize('Synthetics'), options: { should_show_asterick_at_end: true } },
                { text: localize('Forex: standard') },
                { text: localize('Stocks') },
                { text: localize('Stock indices') },
                { text: localize('Commodities') },
                { text: localize('Cryptocurrencies') },
                {
                    text: localize('*Boom 300 and Crash 300 Index'),
                    options: { color: 'loss-danger', weight: 'bold', styles: { paddingTop: '2rem' } },
                },
            ],
        },
    },
];

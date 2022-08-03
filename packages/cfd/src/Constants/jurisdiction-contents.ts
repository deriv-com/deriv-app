import { localize } from '@deriv/translations';

type TJurisdictionContent = {
    svg: {
        header: string;
        over_header?: string;
        synthetic_contents: Array<string>;
        financial_contents: Array<string>;
        is_over_header_available: boolean;
    };
    vanuatu: {
        header: string;
        over_header: string;
        synthetic_contents: Array<string>;
        financial_contents: Array<string>;
        is_over_header_available: boolean;
    };
    labuan: {
        header: string;
        over_header: string;
        synthetic_contents: Array<string>;
        financial_contents: Array<string>;
        is_over_header_available: boolean;
    };
    maltainvest: {
        header: string;
        over_header: string;
        synthetic_contents: Array<string>;
        financial_contents: Array<string>;
        is_over_header_available: boolean;
    };
    bvi: {
        header: string;
        over_header: string;
        synthetic_contents: Array<string>;
        financial_contents: Array<string>;
        is_over_header_available: boolean;
    };
};

export const jurisdiction_contents: TJurisdictionContent = {
    svg: {
        is_over_header_available: false,
        header: localize('St. Vincent & Grenadines'),
        synthetic_contents: [
            `${localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            `${localize('25+ assets: synthetics')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize(
                '170+ assets: forex (standard/micro), stocks, stock indices, commodities, basket indices, and cryptocurrencies'
            )}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
    },
    vanuatu: {
        over_header: localize('Better spreads'),
        is_over_header_available: true,
        header: localize('Vanuatu'),
        synthetic_contents: [
            `${localize('Regulated by the Vanuatu Financial Services Commission')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('30+ assets: forex and commodities')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize('Regulated by the Vanuatu Financial Services Commission')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('30+ assets: forex and commodities')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
    },
    labuan: {
        over_header: localize('Straight-through processing'),
        is_over_header_available: true,
        header: localize('Labuan'),
        synthetic_contents: [
            `${localize('Regulated by the Labuan Financial Services Authority (Licence no. MB/18/0024)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('80+ assets: forex and cryptocurrencies')}`,
            `${localize('Leverage up to 1:100')}`,
        ],
        financial_contents: [
            `${localize('Regulated by the Labuan Financial Services Authority (Licence no. MB/18/0024)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('80+ assets: forex and cryptocurrencies')}`,
            `${localize('Leverage up to 1:100')}`,
            `${localize('Straight-through processing')}`,
        ],
    },
    maltainvest: {
        over_header: localize('Better spreads'),
        is_over_header_available: true,
        header: localize('Malta Financial'),
        synthetic_contents: [
            `${localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('50+ assets: forex, stocks, stock indices, synthetics indices, and cryptocurrencies.')}`,
            `${localize('Leverage up to 1:30')}`,
        ],
        financial_contents: [
            `${localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('50+ assets: forex, stocks, stock indices, synthetics indices, and cryptocurrencies.')}`,
            `${localize('Leverage up to 1:30')}`,
        ],
    },
    bvi: {
        over_header: localize('Better spreads'),
        is_over_header_available: true,
        header: localize('British Virgin Islands'),
        synthetic_contents: [
            `${localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            )}`,
            `${localize('25+ assets: synthetics')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            )}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize(
                '170+ assets: forex (standard/micro), stocks, stock indices, commodities, basket indices, and cryptocurrencies'
            )}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
    },
};

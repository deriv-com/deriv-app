import { localize } from '@deriv/translations';

type TJurisdictionCardItems = {
    header: string;
    over_header?: string;
    synthetic_contents: Array<string>;
    financial_contents: Array<string>;
    swapfree_contents?: Array<string>;
    is_over_header_available: boolean;
};
type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const jurisdiction_contents: TJurisdictionContent = {
    svg: {
        is_over_header_available: false,
        header: localize('St. Vincent & Grenadines'),
        synthetic_contents: [
            `${localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            `${localize('30+ assets: synthetics, basket indices and derived FX')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize(
                '165+ assets: forex (standard/micro), stocks, stock indices, commodities, and cryptocurrencies'
            )}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        swapfree_contents: [
            `${localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize(
                '165+ assets: forex (standard/micro), stocks, stock indices, commodities, and cryptocurrencies'
            )}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
    },
    vanuatu: {
        is_over_header_available: false,
        header: localize('Vanuatu'),
        synthetic_contents: [
            `${localize('Regulated by the Vanuatu Financial Services Commission')}`,
            `${localize('30+ assets: synthetics, basket indices and derived FX')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize('Regulated by the Vanuatu Financial Services Commission')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('90+ assets: forex, stock indices, commodities and cryptocurrencies')}`,
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
        is_over_header_available: false,
        header: localize('Malta'),
        synthetic_contents: [
            `${localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('150+ assets: forex, stocks, stock indices, synthetics, commodities and cryptocurrencies')}`,
            `${localize('Leverage up to 1:30')}`,
        ],
        financial_contents: [
            `${localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)')}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize('150+ assets: forex, stocks, stock indices, synthetics, commodities and cryptocurrencies')}`,
            `${localize('Leverage up to 1:30')}`,
        ],
    },
    bvi: {
        is_over_header_available: false,
        header: localize('British Virgin Islands'),
        synthetic_contents: [
            `${localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            )}`,
            `${localize('30+ assets: synthetics, basket indices and derived FX')}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
        financial_contents: [
            `${localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            )}`,
            `${localize('Registered with the Financial Commission')}`,
            `${localize(
                '165+ assets: forex (standard/micro), stocks, stock indices, commodities, and cryptocurrencies'
            )}`,
            `${localize('Leverage up to 1:1000')}`,
        ],
    },
};

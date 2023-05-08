import { localize } from '@deriv/translations';

type TJurisdictionCardItems = {
    header: string;
    over_header: string;
    synthetic_contents: Array<string>;
    financial_contents: Array<string>;
};
type TJurisdictionContent = {
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    bvi: TJurisdictionCardItems;
};

export const getJurisdictionContents = (): TJurisdictionContent => ({
    svg: {
        header: 'St. Vincent & Grenadines',
        over_header: '',
        synthetic_contents: [
            localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)'),
            localize('30+ assets: synthetics, basket indices and derived FX'),
            localize('Leverage up to 1:1000'),
        ],
        financial_contents: [
            localize('Selecting this will onboard you through Deriv (SVG) LLC (company no. 273 LLC 2020)'),
            localize('Registered with the Financial Commission'),
            localize('165+ assets: forex (standard/micro), stocks, stock indices, commodities, and cryptocurrencies'),
            localize('Leverage up to 1:1000'),
        ],
    },
    vanuatu: {
        header: 'Vanuatu',
        over_header: '',
        synthetic_contents: [
            localize('Regulated by the Vanuatu Financial Services Commission'),
            localize('30+ assets: synthetics, basket indices and derived FX'),
            localize('Leverage up to 1:1000'),
        ],
        financial_contents: [
            localize('Regulated by the Vanuatu Financial Services Commission'),
            localize('Registered with the Financial Commission'),
            localize('90+ assets: forex, stock indices, commodities and cryptocurrencies'),
            localize('Leverage up to 1:1000'),
        ],
    },
    labuan: {
        header: 'Labuan',
        over_header: localize('Straight-through processing'),
        synthetic_contents: [
            localize('Regulated by the Labuan Financial Services Authority (Licence no. MB/18/0024)'),
            localize('Registered with the Financial Commission'),
            localize('80+ assets: forex and cryptocurrencies'),
            localize('Leverage up to 1:100'),
        ],
        financial_contents: [
            localize('Regulated by the Labuan Financial Services Authority (Licence no. MB/18/0024)'),
            localize('Registered with the Financial Commission'),
            localize('80+ assets: forex and cryptocurrencies'),
            localize('Leverage up to 1:100'),
            localize('Straight-through processing'),
        ],
    },
    maltainvest: {
        header: 'Malta',
        over_header: '',
        synthetic_contents: [
            localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
            localize('Registered with the Financial Commission'),
            localize('150+ assets: forex, stocks, stock indices, synthetics, commodities and cryptocurrencies'),
            localize('Leverage up to 1:30'),
        ],
        financial_contents: [
            localize('Regulated by the Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
            localize('Registered with the Financial Commission'),
            localize('150+ assets: forex, stocks, stock indices, synthetics, commodities and cryptocurrencies'),
            localize('Leverage up to 1:30'),
        ],
    },
    bvi: {
        header: 'British Virgin Islands',
        over_header: '',
        synthetic_contents: [
            localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            ),
            localize('30+ assets: synthetics, basket indices and derived FX'),
            localize('Leverage up to 1:1000'),
        ],
        financial_contents: [
            localize(
                'Regulated by the British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)'
            ),
            localize('Registered with the Financial Commission'),
            localize('165+ assets: forex (standard/micro), stocks, stock indices, commodities, and cryptocurrencies'),
            localize('Leverage up to 1:1000'),
        ],
    },
});

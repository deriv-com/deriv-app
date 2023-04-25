import React from 'react';
import { render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';
import JurisdictionCard from '../jurisdiction-card';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionCard', () => {
    const mock_store = {
        common: {},
        client: {},
        ui: {},
    };
    const mock_context = new RootStore(mock_store);
    let mock_props = {
        account_type: 'financial',
        disabled: false,
        context: mock_context,
        jurisdiction_selected_shortcode: '',
        setJurisdictionSelectedShortcode: jest.fn(),
        type_of_card: Jurisdiction.SVG,
        financial_available_accounts: [
            {
                market_type: 'financial' as const,
                name: '',
                requirements: {
                    after_first_deposit: {
                        financial_assessment: [''],
                    },
                    compliance: {
                        mt5: [''],
                        tax_information: [''],
                    },
                    signup: [''],
                },
                shortcode: Jurisdiction.SVG,
                sub_account_type: '',
            },
        ],
        synthetic_available_accounts: [
            {
                market_type: 'gaming' as const,
                name: '',
                requirements: {
                    after_first_deposit: {
                        financial_assessment: [''],
                    },
                    compliance: {
                        mt5: [''],
                        tax_information: [''],
                    },
                    signup: [''],
                },
                shortcode: Jurisdiction.SVG,
                sub_account_type: '',
            },
        ],
        card_flip_status: {
            svg: false,
            bvi: false,
            vanuatu: false,
            labuan: false,
            maltainvest: false,
        },
        flipCard: jest.fn(),
    };
    beforeEach(() => {
        mock_props = {
            account_type: 'financial',
            disabled: false,
            context: mock_context,
            jurisdiction_selected_shortcode: '',
            setJurisdictionSelectedShortcode: jest.fn(),
            type_of_card: Jurisdiction.SVG,
            financial_available_accounts: [
                {
                    market_type: 'financial' as const,
                    name: '',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: [''],
                        },
                        compliance: {
                            mt5: [''],
                            tax_information: [''],
                        },
                        signup: [''],
                    },
                    shortcode: Jurisdiction.SVG,
                    sub_account_type: '',
                },
            ],
            synthetic_available_accounts: [
                {
                    market_type: 'gaming' as const,
                    name: '',
                    requirements: {
                        after_first_deposit: {
                            financial_assessment: [''],
                        },
                        compliance: {
                            mt5: [''],
                            tax_information: [''],
                        },
                        signup: [''],
                    },
                    shortcode: Jurisdiction.SVG,
                    sub_account_type: '',
                },
            ],
            card_flip_status: {
                svg: false,
                bvi: false,
                vanuatu: false,
                labuan: false,
                maltainvest: false,
            },
            flipCard: jest.fn(),
        };
    });

    it('should render JurisdictionCard with svg card', () => {
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with vanuatu card', () => {
        mock_props.type_of_card = Jurisdiction.VANUATU;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('90+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stock indices, Commodities and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with maltainvest card', () => {
        mock_props.type_of_card = Jurisdiction.MALTA_INVEST;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Malta')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('140+')).toBeInTheDocument();
        expect(
            screen.getByText('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')
        ).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:30')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('Malta Financial Services Authority (MFSA) (licence no. IS/70156)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with bvi card', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('British Virgin Islands')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.5 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(
            screen.getByText('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)')
        ).toBeInTheDocument();
    });

    it('should render JurisdictionCard with labuan card', () => {
        mock_props.type_of_card = Jurisdiction.LABUAN;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('Straight-through processing')).toBeInTheDocument();
        expect(screen.getByText('Labuan')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('90+')).toBeInTheDocument();
        expect(screen.getByText('Forex and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:100')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
        expect(screen.getByText('about verifications needed.')).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Labuan Financial Services Authority (licence no. MB/18/0024)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with synthetic account_type', () => {
        mock_props.account_type = 'synthetic';
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('40+')).toBeInTheDocument();
        expect(screen.getByText('Synthetics, Basket indices and Derived FX')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });

    it('should render JurisdictionCard with disabled to be true', () => {
        mock_props.disabled = true;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
    });

    it('should render JurisdictionCard on the back', () => {
        mock_props.card_flip_status.svg = true;
        render(<JurisdictionCard {...mock_props} />);
        expect(screen.getByText('We need you to submit these in order to get this account:')).toBeInTheDocument();
        expect(screen.getByText('Your document is pending for verification.')).toBeInTheDocument();
        expect(screen.getByText('Verification failed. Resubmit during account creation.')).toBeInTheDocument();
        expect(screen.getByText('Your document is verified.')).toBeInTheDocument();
    });

    it('should click on JurisdictionCard and render setJurisdictionSelectedShortCode function', () => {
        render(<JurisdictionCard {...mock_props} />);
        const jurisdiction_card = screen.getByTestId('dt_jurisdiction_card');
        jurisdiction_card.click();
        expect(mock_props.setJurisdictionSelectedShortcode).toHaveBeenCalledWith('svg');
    });

    it('should render BVI type JurisdictionCard, click on Learn more and render flipCard function', () => {
        mock_props.type_of_card = Jurisdiction.BVI;
        render(<JurisdictionCard {...mock_props} />);
        const learn_more_text = screen.getByText('Learn more');
        learn_more_text.click();
        expect(mock_props.flipCard).toHaveBeenCalledWith('bvi');
    });
});

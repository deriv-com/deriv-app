import React from 'react';
import RootStore from 'Stores/index';
import { render, screen } from '@testing-library/react';
import { Jurisdiction } from '@deriv/shared';
import JurisdictionModalContent from '../jurisdiction-modal-content';

describe('JurisdictionModalContent', () => {
    const mock_store = {
        common: {},
        client: {},
        ui: {},
    };
    const mock_context = new RootStore(mock_store);
    const mock_props = {
        account_status: mock_context.client,
        account_type: '',
        is_non_idv_design: false,
        is_virtual: false,
        jurisdiction_selected_shortcode: '',
        setJurisdictionSelectedShortcode: jest.fn(),
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
                shortcode: Jurisdiction.BVI,
                sub_account_type: '',
            },
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
                shortcode: Jurisdiction.VANUATU,
                sub_account_type: '',
            },
        ],
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
                shortcode: Jurisdiction.BVI,
                sub_account_type: '',
            },
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
                shortcode: Jurisdiction.VANUATU,
                sub_account_type: '',
            },
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
                shortcode: Jurisdiction.LABUAN,
                sub_account_type: '',
            },
        ],
        context: mock_context,
        real_synthetic_accounts_existing_data: [],
        real_financial_accounts_existing_data: [],
        real_swapfree_accounts_existing_data: [],
        swapfree_available_accounts: [
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

    it('should display cfd-jurisdiction-card--synthetic__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='synthetic' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--synthetic__wrapper');
    });

    it('should display 3 types of jurisdiction card for synthetics account', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='synthetic' />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('British Virgin Islands')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
    });

    it('should display content of 3 types of jurisdiction correctly for synthetics account', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='synthetic' />);
        expect(screen.getAllByText('Assets')).toHaveLength(3);
        expect(screen.getAllByText('Synthetics, Basket indices and Derived FX')).toHaveLength(3);
        expect(screen.getAllByText('40+')).toHaveLength(3);
        expect(screen.getAllByText('Leverage')).toHaveLength(3);
        expect(screen.getAllByText('1:1000')).toHaveLength(3);
        expect(screen.getAllByText('Verifications')).toHaveLength(3);
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getAllByText('Learn more')).toHaveLength(2);
        expect(screen.getAllByText('about verifications needed.')).toHaveLength(2);
        expect(screen.getAllByText('Regulator/EDR')).toHaveLength(3);
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
        expect(
            screen.getByText('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)')
        ).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
    });

    it('should display cfd-jurisdiction-card--financial__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--financial__wrapper');
    });

    it('should display 4 types of jurisdiction card for financial account', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('British Virgin Islands')).toBeInTheDocument();
        expect(screen.getByText('Vanuatu')).toBeInTheDocument();
        expect(screen.getByText('Labuan')).toBeInTheDocument();
    });

    it('should display content of 4 types of jurisdiction correctly for synthetics account', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        expect(screen.getAllByText('Assets')).toHaveLength(4);
        expect(screen.getAllByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toHaveLength(2);
        expect(screen.getByText('Forex, Stock indices, Commodities and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Forex and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getAllByText('Leverage')).toHaveLength(4);
        expect(screen.getAllByText('1:1000')).toHaveLength(3);
        expect(screen.getByText('1:100')).toBeInTheDocument();
        expect(screen.getAllByText('Spreads from')).toHaveLength(4);
        expect(screen.getAllByText('0.6 pips')).toHaveLength(2);
        expect(screen.getAllByText('0.5 pips')).toHaveLength(2);
        expect(screen.getAllByText('Verifications')).toHaveLength(4);
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getAllByText('Learn more')).toHaveLength(3);
        expect(screen.getAllByText('about verifications needed.')).toHaveLength(3);
        expect(screen.getAllByText('Regulator/EDR')).toHaveLength(4);
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
        expect(
            screen.getByText('British Virgin Islands Financial Services Commission (License no. SIBA/L/18/1114)')
        ).toBeInTheDocument();
        expect(screen.getByText('Vanuatu Financial Services Commission')).toBeInTheDocument();
        expect(screen.getByText('Labuan Financial Services Authority (licence no. MB/18/0024)')).toBeInTheDocument();
    });

    it('should display only financial maltainvest for MF clients', () => {
        mock_props.financial_available_accounts = [
            { ...mock_props.financial_available_accounts[0], shortcode: Jurisdiction.MALTA_INVEST },
        ];
        mock_props.synthetic_available_accounts = [];
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--financial__wrapper');
        expect(screen.queryByText('St. Vincent & Grenadines')).not.toBeInTheDocument();
        expect(screen.queryByText('British Virgin Islands')).not.toBeInTheDocument();
        expect(screen.queryByText('Vanuatu')).not.toBeInTheDocument();
        expect(screen.queryByText('Labuan')).not.toBeInTheDocument();
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

    it('should display only financial svg for highrisk clients', () => {
        mock_props.financial_available_accounts = [
            { ...mock_props.financial_available_accounts[0], shortcode: Jurisdiction.SVG },
        ];
        mock_props.synthetic_available_accounts = [
            { ...mock_props.synthetic_available_accounts[0], shortcode: Jurisdiction.SVG },
        ];
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--financial__wrapper');
        expect(screen.queryByText('British Virgin Islands')).not.toBeInTheDocument();
        expect(screen.queryByText('Vanuatu')).not.toBeInTheDocument();
        expect(screen.queryByText('Labuan')).not.toBeInTheDocument();
        expect(screen.queryByText('Malta')).not.toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
        expect(screen.getByText('170+')).toBeInTheDocument();
        expect(screen.getByText('Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies')).toBeInTheDocument();
        expect(screen.getByText('Spreads from')).toBeInTheDocument();
        expect(screen.getByText('0.6 pips')).toBeInTheDocument();
    });

    it('should display only synthetic svg for highrisk clients', () => {
        mock_props.financial_available_accounts = [
            { ...mock_props.financial_available_accounts[0], shortcode: Jurisdiction.SVG },
        ];
        mock_props.synthetic_available_accounts = [
            { ...mock_props.synthetic_available_accounts[0], shortcode: Jurisdiction.SVG },
        ];
        render(<JurisdictionModalContent {...mock_props} account_type='synthetic' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--synthetic__wrapper');
        expect(screen.queryByText('British Virgin Islands')).not.toBeInTheDocument();
        expect(screen.queryByText('Vanuatu')).not.toBeInTheDocument();
        expect(screen.queryByText('Labuan')).not.toBeInTheDocument();
        expect(screen.queryByText('Malta')).not.toBeInTheDocument();
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
        expect(screen.getByText('40+')).toBeInTheDocument();
        expect(screen.getByText('Synthetics, Basket indices and Derived FX')).toBeInTheDocument();
    });

    it('should display cfd-jurisdiction-card--all__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='all' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--all__wrapper');
    });

    it('should display only svg jurisdiction card for swap-free account', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='all' />);
        expect(screen.getByText('St. Vincent & Grenadines')).toBeInTheDocument();
        expect(screen.queryByText('British Virgin Islands')).not.toBeInTheDocument();
        expect(screen.queryByText('Labuan')).not.toBeInTheDocument();
        expect(screen.queryByText('Vanuatu')).not.toBeInTheDocument();
    });

    it('should display content of swap-free jurisdiction correctly in card', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='all' />);
        expect(screen.getByText('Assets')).toBeInTheDocument();
        expect(
            screen.getByText('Synthetics, Forex, Stocks, Stock Indices, Cryptocurrencies, and ETFs')
        ).toBeInTheDocument();
        expect(screen.getByText('40+')).toBeInTheDocument();
        expect(screen.getByText('Leverage')).toBeInTheDocument();
        expect(screen.getByText('1:1000')).toBeInTheDocument();
        expect(screen.getByText('Verifications')).toBeInTheDocument();
        expect(
            screen.getByText('You will need to submit proof of identity and address once you reach certain thresholds.')
        ).toBeInTheDocument();
        expect(screen.getByText('Regulator/EDR')).toBeInTheDocument();
        expect(screen.getByText('Deriv (SVG) LLC (company no. 273 LLC 2020)')).toBeInTheDocument();
    });
});

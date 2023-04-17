import React from 'react';
import JurisdictionModalContent from '../jurisdiction-modal-content';
import RootStore from 'Stores/index';
import { render, screen } from '@testing-library/react';
import { Jurisdiction } from '@deriv/shared';

describe('JurisdictionModalContent', () => {
    const mock_store = {
        common: {},
        client: {},
        ui: {},
    };
    const mock_context = new RootStore(mock_store);
    const mock_props = {
        account_type: '',
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

    it('should display 4 types of jurisdiction card for financial account', async () => {
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
});

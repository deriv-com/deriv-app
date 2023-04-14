import React from 'react';
import JurisdictionModalContent from '../jurisdiction-modal-content';
import { render, screen } from '@testing-library/react';
import RootStore from 'Stores/index';

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
                shortcode: 'svg' as const,
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
                shortcode: 'bvi' as const,
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
                shortcode: 'svg' as const,
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
                shortcode: 'bvi' as const,
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
    });

    it('should display cfd-jurisdiction-card--financial__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
    });
});

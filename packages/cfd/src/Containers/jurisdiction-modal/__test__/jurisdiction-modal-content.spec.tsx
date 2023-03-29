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
        synthetic_available_accounts: [],
        financial_available_accounts: [],
        context: mock_context,
        real_synthetic_accounts_existing_data: [],
        real_financial_accounts_existing_data: [],
    };

    it('should display cfd-jurisdiction-card--synthetic__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='synthetic' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--synthetic__wrapper');
    });

    it('should display cfd-jurisdiction-card--financial__wrapper in class name', () => {
        render(<JurisdictionModalContent {...mock_props} account_type='financial' />);
        const container = screen.getByTestId('dt-jurisdiction-modal-content');
        expect(container).toHaveClass('cfd-jurisdiction-card--financial__wrapper');
    });
});

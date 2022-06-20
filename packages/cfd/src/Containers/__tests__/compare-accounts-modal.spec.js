import React from 'react';
import { screen, render, infinity } from '@testing-library/react';
import CompareAccountsModal from '../compare-accounts-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('should render the <CompareAccountsModal /> component', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        let modal_root_el = document.getElementById('modal_root');
        document.body.removeChild(modal_root_el);
    });

    const mock_props = {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        is_compare_accounts_visible: true,
        landing_companies: {
            mt_gaming_company: {
                financial: 'USD',
            },
            mt_financial_company: {
                financial: 'USD',
                financial_stp: 'USD',
            },
        },
        is_loading: false,
        is_logged_in: true,
        is_eu: false,
        is_uk: false,
        is_eu_country: false,
        platform: 'mt5',
        residence: 'idn',
        toggleCompareAccounts: jest.fn(),
    };

    it('should render the <CompareAccountsModal /> component', () => {
        render(<CompareAccountsModal {...mock_props} />);
        screen.debug(undefined, 40000);
    });
});

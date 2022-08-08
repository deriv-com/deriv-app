import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CompareAccountsModal from '../compare-accounts-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

let modal_root_el;

beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

describe('CompareAccountsModal', () => {
    const mock_props = {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        is_compare_accounts_visible: true,
        is_loading: false,
        is_logged_in: true,
        is_eu: false,
        is_uk: false,
        is_eu_country: false,
        is_real_enabled: true,
        platform: 'mt5',
        residence: 'id',
        is_demo_tab: 'false',
        toggleCompareAccounts: jest.fn(),
        openPasswordModal: jest.fn(),
        openDerivRealAccountNeededModal: jest.fn(),
    };

    it('should render the modal', () => {
        render(<CompareAccountsModal {...mock_props} />);
        screen.debug();
    });
});

import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import CompareAccountsModal from '../compare-accounts-modal';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));
beforeAll(() => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

describe('should render the <CompareAccountsModal /> component', () => {
    const only_gaming_company = {
        mt_gaming_company: {
            financial: 'USD',
        },
    };

    const all_landing_companies = {
        mt_gaming_company: {
            financial: 'USD',
        },
        mt_financial_company: {
            financial: 'USD',
            financial_stp: 'USD',
        },
    };

    const mock_props = {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
        is_compare_accounts_visible: false,
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
        const { container } = render(<CompareAccountsModal {...mock_props} />);
        expect(container.firstChild).toHaveClass('cfd-compare-accounts-modal__wrapper');
    });

    it('expect compare-accounts-content to pop up when the compare accounts button is clicked', () => {
        render(<CompareAccountsModal {...mock_props} landing_companies={all_landing_companies} />);
        expect(screen.queryByText(/compare accounts/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/compare accounts/i));
        expect(mock_props.toggleCompareAccounts).toHaveBeenCalled();
    });

    it('should render the proper style for Mt5 platforms', () => {
        render(<CompareAccountsModal {...mock_props} landing_companies={only_gaming_company} platform='mt5' />);
        const div_element = document.getElementsByClassName('cfd-compare-accounts-modal__wrapper');
        const style = window.getComputedStyle(div_element[0]);
        expect(style.marginTop).toBe('2.4rem');
    });

    it('should render the proper text if the user is from an eu country', () => {
        render(
            <CompareAccountsModal
                {...mock_props}
                landing_companies={all_landing_companies}
                is_eu_country={true}
                is_eu={true}
                is_compare_accounts_visible={true}
            />
        );
        expect(screen.getAllByText('USD')[0]).toBeInTheDocument();
    });

    it('should render the proper text if the user is from an uk country', () => {
        render(
            <CompareAccountsModal
                {...mock_props}
                landing_companies={all_landing_companies}
                is_uk={true}
                is_compare_accounts_visible={true}
            />
        );
    });

    it('should render the proper style for Dxtrade platforms', () => {
        render(<CompareAccountsModal {...mock_props} landing_companies={only_gaming_company} platform='dxtrade' />);
        const div_element = document.getElementsByClassName('cfd-compare-accounts-modal__wrapper');
        const style = window.getComputedStyle(div_element[0]);
        expect(style.marginTop).toBe('5rem');
    });
});

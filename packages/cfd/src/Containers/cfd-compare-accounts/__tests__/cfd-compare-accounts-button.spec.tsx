import React from 'react';
// import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import CFDCompareAccountsButton from '../cfd-compare-accounts-button';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@deriv/components/src/components/cfd-compare-accounts-carousel/cfd-compare-accounts-carousel', () =>
    jest.fn(() => <div>CFD Carousel</div>)
);

const cfd_store_mock = {
    current_list: [],
    setAccountType: jest.fn(),
    setJurisdictionSelectedShortcode: jest.fn(),
    enableCFDPasswordModal: jest.fn(),
    toggleCFDVerificationModal: jest.fn(),
};

describe('<CFDCompareAccountsButton />', () => {
    const mocked_props = {
        trading_platforms: {
            platform: 'mt5',
            shortcode: 'svg',
            market_type: 'gaming',
        },
        is_demo: false,
    };

    it('renders the component with correct mocked_props', () => {
        const mock = mockStore({
            client: {
                account_status: { cashier_validation: ['system_maintenance'] },
                current_currency_type: 'crypto',
                is_logged_in: true,
            },
            modules: { cfd: cfd_store_mock },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CFDCompareAccountsButton {...mocked_props} />, {
            wrapper,
        });

        const buttonElement = screen.getByRole('button');

        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('compare-cfd-account__button');
        expect(buttonElement).toHaveTextContent('Add');
        expect(buttonElement).toBeEnabled();
    });
});

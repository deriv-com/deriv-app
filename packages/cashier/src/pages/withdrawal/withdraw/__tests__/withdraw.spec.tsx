import React from 'react';
import { render, screen } from '@testing-library/react';
import Withdraw from '../withdraw';
import CashierProviders from '../../../../cashier-providers';

jest.mock('Components/cashier-container/real', () => jest.fn(() => 'mockedReal'));

describe('<Withdraw />', () => {
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            client: {
                verification_code: { payment_withdraw: 'code' },
            },
            ui: {
                is_dark_mode_on: false,
            },
            modules: {
                cashier: {
                    general_store: {
                        setActiveTab: jest.fn(),
                    },
                    iframe: {
                        iframe_url: 'https://cashier.deriv.com',
                        clearIframe: jest.fn(),
                    },
                    withdraw: {
                        container: 'withdraw',
                        onMountWithdraw: jest.fn(),
                    },
                },
            },
        };
    });

    it('should render the cashier container component', () => {
        render(
            <CashierProviders store={mockRootStore}>
                <Withdraw />
            </CashierProviders>
        );

        expect(mockRootStore.modules.cashier.withdraw.onMountWithdraw).toHaveBeenCalledWith('code');
        expect(screen.getByText('mockedReal')).toBeInTheDocument();
    });
});

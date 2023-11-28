import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalFiat from '../withdrawal-fiat';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';

jest.mock('Components/cashier-container/real', () => jest.fn(() => 'mockedReal'));

describe('<WithdrawalFiat />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
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
        });
    });

    it('should render the cashier container component', () => {
        render(
            <CashierProviders store={mockRootStore}>
                <WithdrawalFiat />
            </CashierProviders>
        );

        expect(mockRootStore.modules.cashier.withdraw.onMountWithdraw).toHaveBeenCalledWith('code');
        expect(screen.getByText('mockedReal')).toBeInTheDocument();
    });
});

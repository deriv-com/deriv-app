import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../../cashier-providers';
import Withdraw from '../withdraw';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWithdrawalFiatAddress: jest.fn(() => ({
        data: undefined,
        error: null,
        isSuccess: false,
        resetVerificationCode: jest.fn(),
    })),
}));

describe('<Withdraw />', () => {
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                is_authorize: true,
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
                    withdraw: {
                        container: 'withdraw',
                        onMountWithdraw: jest.fn(),
                    },
                },
            },
        });
    });

    it('should render the <WithdrawalFiatIframeModule />', () => {
        render(
            <CashierProviders store={mockRootStore}>
                <Withdraw />
            </CashierProviders>
        );

        expect(screen.getByTestId('dt_withdrawal_fiat_iframe_module')).toBeInTheDocument();
    });
});

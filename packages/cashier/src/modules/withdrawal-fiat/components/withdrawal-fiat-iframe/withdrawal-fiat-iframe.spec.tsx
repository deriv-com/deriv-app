import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalFiatIframe from './withdrawal-fiat-iframe';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../../cashier-providers';
import { useWithdrawalFiatAddress } from '@deriv/hooks';

let mockUseWithdrawalFiatAddress: {
    data: string | undefined;
    error: string | null;
    isSuccess: boolean;
    resetVerificationCode: any;
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWithdrawalFiatAddress: jest.fn(() => mockUseWithdrawalFiatAddress),
}));

const mock_root_store = mockStore({
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

const wrapper = ({ children }: { children: JSX.Element }) => (
    <CashierProviders store={mock_root_store}>{children}</CashierProviders>
);

describe('<WithdrawalFiatIframe />', () => {
    it('should show the loader when the iframe url is still not received from the cashier API call', () => {
        mockUseWithdrawalFiatAddress = {
            data: undefined,
            error: null,
            isSuccess: false,
            resetVerificationCode: jest.fn(),
        };
        render(<WithdrawalFiatIframe />, { wrapper });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render the iframe with the correct url', () => {
        mockUseWithdrawalFiatAddress = {
            data: 'https://example.com',
            error: null,
            isSuccess: true,
            resetVerificationCode: jest.fn(),
        };

        render(<WithdrawalFiatIframe />);

        expect(screen.getByTestId('dt_withdrawal_fiat_iframe')).toHaveAttribute('src', 'https://example.com');
    });
});

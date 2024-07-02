import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import WithdrawalCryptoPriority from '../withdrawal-crypto-priority';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { useCryptoEstimations } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useCryptoEstimations: jest.fn(),
}));

describe('<WithdrawalCryptoPriority />', () => {
    (useCryptoEstimations as jest.Mock).mockReturnValue({
        count_down: 10,
        crypto_estimations_fee: '0.0023',
        crypto_estimations_fee_unique_id: 'unique_id',
        getCryptoEstimations: jest.fn(),
        server_time: 123456789,
        setCurrencyCode: jest.fn(),
    });
    let mockRootStore: ReturnType<typeof mockStore>;
    beforeEach(() => {
        mockRootStore = mockStore({
            client: {
                currency: 'BTC',
                verification_code: { payment_withdraw: 'code' },
            },
            modules: {
                cashier: {
                    withdraw: {
                        requestWithdraw: jest.fn(),
                        setBlockchainAddress: jest.fn(),
                        setWithdrawPercentageSelectorResult: jest.fn(),
                        setCryptoEstimationsFee: jest.fn().mockReturnValue(0.001),
                        setCryptoEstimationsFeeUniqueId: jest.fn().mockReturnValue('unique_id'),
                    },
                    crypto_fiat_converter: {
                        onChangeConverterFromAmount: jest.fn(),
                    },
                },
            },
        });
    });

    const mockWithdrawalCryptoPriority = () => (
        <CashierProviders store={mockRootStore}>
            <WithdrawalCryptoPriority />
        </CashierProviders>
    );

    const renderWithdrawalCryptoForm = () => {
        return render(mockWithdrawalCryptoPriority());
    };

    it('should render WithdrawalCryptoPriority component', () => {
        renderWithdrawalCryptoForm();

        expect(screen.getByText('Priority withdrawal')).toBeInTheDocument();
        expect(screen.queryByText('Amount received:')).not.toBeInTheDocument();
    });

    it('crypto_estimation_fee should be displayed when checkbox is checked', async () => {
        const { rerender } = renderWithdrawalCryptoForm();
        const checkbox = screen.getByLabelText('Priority withdrawal');

        await act(async () => {
            await userEvent.click(checkbox);
        });
        rerender(mockWithdrawalCryptoPriority());

        expect(screen.getByText('Amount received:')).toBeInTheDocument();
        expect(screen.getByText('0.00230000 BTC')).toBeInTheDocument();
    });
});

import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useCryptoEstimations } from '@deriv/api';
import { useCurrentAccountDetails } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import WithdrawalCryptoForm from '../withdrawal-crypto-form';
import CashierProviders from '../../../../cashier-providers';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useCurrentAccountDetails: jest.fn(() => {
        'icon';
    }),
    useGrowthbookIsOn: jest.fn().mockReturnValue([]),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useCryptoEstimations: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('<WithdrawalCryptoForm />', () => {
    (useCurrentAccountDetails as jest.Mock).mockReturnValue({ icon: 'icon' });
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
                    general_store: {
                        percentageSelectorSelectionStatus: jest.fn(),
                    },
                    crypto_fiat_converter: {
                        onChangeConverterFromAmount: jest.fn(),
                        onChangeConverterToAmount: jest.fn(),
                        resetConverter: jest.fn(),
                    },
                    withdraw: {
                        blockchain_address: 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt',
                        onMountCryptoWithdraw: jest.fn(),
                        requestWithdraw: jest.fn(),
                        setBlockchainAddress: jest.fn(),
                        setWithdrawPercentageSelectorResult: jest.fn(),
                        setCryptoEstimationsFee: jest.fn(),
                        setCryptoEstimationsFeeUniqueId: jest.fn(),
                    },
                },
            },
        });
    });

    const mockWithdrawalCryptoForm = () => (
        <CashierProviders store={mockRootStore}>
            <WithdrawalCryptoForm />
        </CashierProviders>
    );

    const renderWithdrawalCryptoForm = () => {
        return render(mockWithdrawalCryptoForm());
    };

    it('should render arrow left icon when the user focused on the left input', () => {
        renderWithdrawalCryptoForm();

        const el = screen.getByTestId('dt_converter_to_amount_input');
        fireEvent.focus(el);

        expect(screen.getByTestId('dti_arrow_left_bold')).toBeInTheDocument();
    });

    it('component and header should be rendered', () => {
        renderWithdrawalCryptoForm();

        expect(screen.getByText('Your BTC wallet address')).toBeInTheDocument();
        expect(screen.getByTestId('dt_withdrawal_crypto_form')).toBeInTheDocument();
    });

    it('should show a proper error if address is not provided', async () => {
        renderWithdrawalCryptoForm();

        const address_field = screen.getByTestId('dt_address_input');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1' } });
        });
        act(() => {
            fireEvent.change(address_field, { target: { value: '' } });
        });
        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if provided address has less characters than needed', async () => {
        renderWithdrawalCryptoForm();

        const address_field = screen.getByTestId('dt_address_input');

        act(() => {
            fireEvent.change(address_field, { target: { value: 'address less than 25' } });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it('should show a proper error if provided address has more characters than needed', async () => {
        renderWithdrawalCryptoForm();

        const address_field = screen.getByTestId('dt_address_input');

        act(() => {
            fireEvent.change(address_field, {
                target: { value: 'address more than 64 characters created to not pass validation conditions!' },
            });
        });
        await waitFor(() => {
            expect(screen.getByText('Your wallet address should have 25 to 64 characters.')).toBeInTheDocument();
        });
    });

    it("requestWithdraw func should be called if value provided from 'converter_from_amount' input and withdraw button is clicked", async () => {
        const mockJson = {
            BTC: {
                USD: 2.2,
            },
        };
        window.localStorage.setItem('exchange_rates', JSON.stringify(mockJson));

        renderWithdrawalCryptoForm();

        const address_field = screen.getByTestId('dt_address_input');
        const converter_from_amount_field = screen.getByTestId('dt_converter_from_amount_input');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_from_amount_field, { target: { value: '0.0006' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });

        await waitFor(() => expect(mockRootStore.modules.cashier.withdraw.requestWithdraw).toHaveBeenCalled());
    });

    it("requestWithdraw func should be called if value provided from 'converter_to_amount' input and withdraw button is clicked", async () => {
        const mockJson = {
            BTC: {
                USD: 2.2,
            },
        };
        window.localStorage.setItem('exchange_rates', JSON.stringify(mockJson));

        renderWithdrawalCryptoForm();

        const address_field = screen.getByTestId('dt_address_input');
        const converter_to_amount_field = screen.getByTestId('dt_converter_to_amount_input');
        const withdraw_button = screen.getByText('Withdraw');

        act(() => {
            fireEvent.change(address_field, { target: { value: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2' } });
        });
        act(() => {
            fireEvent.change(converter_to_amount_field, { target: { value: '200' } });
        });
        act(() => {
            fireEvent.click(withdraw_button);
        });
        await waitFor(() => expect(mockRootStore.modules.cashier.withdraw.requestWithdraw).toHaveBeenCalled());
    });
});

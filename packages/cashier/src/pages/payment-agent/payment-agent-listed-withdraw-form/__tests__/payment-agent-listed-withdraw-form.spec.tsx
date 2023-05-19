import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentListedWithdrawForm from '../payment-agent-listed-withdraw-form';
import { validNumber } from '@deriv/shared';
import CashierProviders from '../../../../cashier-providers';
import { mockStore } from '@deriv/stores';
import { TPaymentAgent } from '../../../../types';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/validation/declarative-validation-rules'),
    validNumber: jest.fn(() => ({ is_ok: true, message: '' })),
}));

describe('<PaymentAgentListedWithdrawForm />', () => {
    let mockRootStore: ReturnType<typeof mockStore>, payment_agent: TPaymentAgent;

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });

    afterAll(() => {
        (ReactDOM.createPortal as jest.Mock).mockClear();
    });

    beforeEach(() => {
        mockRootStore = mockStore({
            ui: {
                is_dark_mode_on: false,
                toggleAccountsDialog: jest.fn(),
            },
            client: {
                balance: '1000',
                currency: 'USD',
                verification_code: { payment_agent_withdraw: 'ABCdef' },
            },
            modules: {
                cashier: {
                    general_store: {
                        is_crypto: false,
                        is_loading: false,
                    },
                    payment_agent: {
                        error: {},
                        onMountPaymentAgentWithdraw: jest.fn(),
                        agents: [
                            {
                                email: 'MyPaScript@example.com',
                                max_withdrawal: '2000',
                                min_withdrawal: '10',
                                phone: [{ phone_number: '+12345678' }],
                                text: 'Payment Agent of CR90000102 (Created from Script)',
                                url: [
                                    { url: 'https://www.MyPAMyAdventure.com/' },
                                    { url: 'https://www.MyPAMyAdventure2.com/' },
                                ],
                                value: 'CR90000102',
                            },
                            {
                                email: 'MyPaScript2@example.com',
                                max_withdrawal: '1000',
                                min_withdrawal: '10',
                                phone: [{ phone_number: '+1234567822' }],
                                text: 'Payment Agent of CR90000100 (Created from Script)',
                                url: [
                                    { url: 'https://www.MyPAMyAdventure1.com/' },
                                    { url: 'https://www.MyPAMyAdventure2.com/' },
                                ],
                                value: 'CR90000100',
                            },
                        ],
                        requestTryPaymentAgentWithdraw: jest.fn(),
                    },
                },
            },
        });

        payment_agent = {
            currency: 'USD',
            currencies: 'USD',
            deposit_commission: '0',
            email: 'MyPaScript@example.com',
            further_information: 'Test Info',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            name: 'Payment Agent of CR90000102 (Created from Script)',
            paymentagent_loginid: 'CR90000102',
            phone_numbers: [{ phone_number: '+12345678' }],
            summary: '',
            supported_banks: [{ payment_method: 'MasterCard' }, { payment_method: 'Visa' }],
            supported_payment_methods: [],
            urls: [{ url: 'https://www.MyPAMyAdventure.com/' }, { url: 'https://www.MyPAMyAdventure2.com/' }],
            withdrawal_commission: '0',
        };
    });

    const mockPaymentAgentListedWithdrawForm = () => {
        return (
            <CashierProviders store={mockRootStore}>
                <PaymentAgentListedWithdrawForm payment_agent={payment_agent} />
            </CashierProviders>
        );
    };

    it('should render the component', () => {
        render(mockPaymentAgentListedWithdrawForm());

        expect(screen.getByText('Withdrawal amount')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
        expect(screen.getByText(/withdrawal limits:/i)).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should show loader when is_loading equal to true or there is no payment agents', () => {
        mockRootStore.modules.cashier.general_store.is_loading = true;
        const { rerender } = render(mockPaymentAgentListedWithdrawForm());

        expect(screen.getByText('Loading')).toBeInTheDocument();

        mockRootStore.modules.cashier.payment_agent.agents = [];

        rerender(mockPaymentAgentListedWithdrawForm());

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show error message, if amount is not valid', async () => {
        (validNumber as jest.Mock).mockReturnValue({ is_ok: false, message: 'error_message' });
        render(mockPaymentAgentListedWithdrawForm());

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '100.99999' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(screen.getByText('error_message')).toBeInTheDocument();
        });
        (validNumber as jest.Mock).mockReturnValue({ is_ok: true, message: '' });
    });

    it('should show Insufficient balance error', async () => {
        render(mockPaymentAgentListedWithdrawForm());

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '2000' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
        });
    });

    it('should trigger requestTryPaymentAgentWithdraw, when all data are valid', async () => {
        render(mockPaymentAgentListedWithdrawForm());

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(mockRootStore.modules.cashier.payment_agent.requestTryPaymentAgentWithdraw).toHaveBeenCalledWith({
                loginid: 'CR90000102',
                currency: 'USD',
                amount: 100,
                verification_code: 'ABCdef',
            });
        });
    });
});

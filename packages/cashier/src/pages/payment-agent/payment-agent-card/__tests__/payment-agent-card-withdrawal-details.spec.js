import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentCardWithdrawalDetails from '../payment-agent-card-withdrawal-details';
import { validNumber } from '@deriv/shared';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading</div>,
}));

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/validation/declarative-validation-rules'),
    validNumber: jest.fn(() => ({ is_ok: true, message: '' })),
}));

describe('<PaymentAgentCardWithdrawalDetails />', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const props = {
        balance: '1000',
        currency: 'USD',
        error: {},
        is_loading: false,
        onMount: jest.fn(),
        payment_agent: {
            currency: 'USD',
            deposit_commission: '0',
            email: 'MyPaScript@example.com',
            further_information: 'Test Info',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            name: 'Payment Agent of CR90000102 (Created from Script)',
            paymentagent_loginid: 'CR90000102',
            phones: [{ phone_number: '+12345678' }],
            supported_banks: [{ payment_method: 'MasterCard' }, { payment_method: 'Visa' }],
            urls: [{ url: 'http://www.MyPAMyAdventure.com/' }, { url: 'http://www.MyPAMyAdventure2.com/' }],
            withdrawal_commission: '0',
        },
        payment_agent_list: [
            {
                email: 'MyPaScript@example.com',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                phone: [{ phone_number: '+12345678' }],
                text: 'Payment Agent of CR90000102 (Created from Script)',
                url: [{ url: 'http://www.MyPAMyAdventure.com/' }, { url: 'http://www.MyPAMyAdventure2.com/' }],
                value: 'CR90000102',
            },
            {
                email: 'MyPaScript2@example.com',
                max_withdrawal: '1000',
                min_withdrawal: '10',
                phone: [{ phone_number: '+1234567822' }],
                text: 'Payment Agent of CR90000100 (Created from Script)',
                url: [{ url: 'http://www.MyPAMyAdventure1.com/' }, { url: 'http://www.MyPAMyAdventure2.com/' }],
                value: 'CR90000100',
            },
        ],
        requestTryPaymentAgentWithdraw: jest.fn(),
        verification_code: 'ABCdef',
    };

    it('should render the component', () => {
        render(<PaymentAgentCardWithdrawalDetails {...props} />);

        expect(screen.getByText('Withdrawal amount')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
        expect(screen.getByText(/withdrawal limits:/i)).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('2,000.00 USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should show loader when is_loading equal to true or there is no payment agents', () => {
        const { rerender } = render(<PaymentAgentCardWithdrawalDetails {...props} is_loading />);

        expect(screen.getByText('Loading')).toBeInTheDocument();

        rerender(<PaymentAgentCardWithdrawalDetails {...props} payment_agent_list={[]} />);

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should show Field is required for amount field, if there is no data and the field was touched', async () => {
        render(<PaymentAgentCardWithdrawalDetails {...props} />);

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.change(el_input_amount, { target: { value: '' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show error message, if amount is not valid', async () => {
        validNumber.mockReturnValue({ is_ok: false, message: 'error_message' });
        render(<PaymentAgentCardWithdrawalDetails {...props} />);

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '100.99999' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(screen.getByText('error_message')).toBeInTheDocument();
        });
        validNumber.mockReturnValue({ is_ok: true, message: '' });
    });

    it('should show Insufficient balance error', async () => {
        render(<PaymentAgentCardWithdrawalDetails {...props} />);

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '2000' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
        });
    });

    it('should trigger requestTryPaymentAgentWithdraw, when all data are valid', async () => {
        render(<PaymentAgentCardWithdrawalDetails {...props} />);

        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(props.requestTryPaymentAgentWithdraw).toHaveBeenCalledWith({
                loginid: 'CR90000102',
                currency: 'USD',
                amount: '100',
                verification_code: 'ABCdef',
            });
        });
    });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentUnlistedWithdrawForm from '../payment-agent-unlisted-withdraw-form';
import { isMobile, validNumber } from '@deriv/shared';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    validNumber: jest.fn(() => ({ is_ok: true, message: '' })),
    isMobile: jest.fn(() => false),
}));

jest.mock('Pages/payment-agent/payment-agent-disclaimer', () => () => <div>PaymentAgentDisclaimer</div>);

describe('<PaymentAgentUnlistedWithdrawForm />', () => {
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
        verification_code: 'ABCdef',
        onMount: jest.fn(),
        requestTryPaymentAgentWithdraw: jest.fn().mockResolvedValue(),
        setIsUnlistedWithdraw: jest.fn(),
    };

    it('should render the component', () => {
        render(<PaymentAgentUnlistedWithdrawForm {...props} />);

        expect(screen.getByTestId('dt-back-arrow-icon')).toBeInTheDocument();
        expect(screen.getByText('Back to list')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter the payment agent account number')).toBeInTheDocument();
        expect(screen.getByText('Example: CR123456789')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
        expect(screen.getByLabelText('Enter amount')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
        expect(screen.getByText('Note: Deriv does not charge any transfer fees.')).toBeInTheDocument();
    });

    it('should trigger onclick callback when arrow back button was clicked', () => {
        render(<PaymentAgentUnlistedWithdrawForm {...props} />);

        const el_back_arrow_icon = screen.getByTestId('dt-back-arrow-icon');
        fireEvent.click(el_back_arrow_icon);

        expect(props.setIsUnlistedWithdraw).toHaveBeenCalledWith(false);
    });

    it('should show different error messages', async () => {
        validNumber.mockReturnValue({ is_ok: false, message: 'error_message' });
        const { rerender } = render(<PaymentAgentUnlistedWithdrawForm {...props} />);

        const el_input_account_number = screen.getByLabelText('Enter the payment agent account number');
        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_account_number, { target: { value: 'CR56656565' } });
        fireEvent.change(el_input_amount, { target: { value: '100.99999' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('error_message')).toBeInTheDocument();
        });
        validNumber.mockReturnValue({ is_ok: true, message: '' });

        rerender(<PaymentAgentUnlistedWithdrawForm {...props} />);
        fireEvent.change(el_input_account_number, { target: { value: 'CR56656565' } });
        fireEvent.change(el_input_amount, { target: { value: '2000' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
        });

        rerender(<PaymentAgentUnlistedWithdrawForm {...props} />);
        fireEvent.change(el_input_account_number, { target: { value: '667766767' } });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);
        await waitFor(() => {
            expect(screen.getByText('Please enter a valid account number. Example: CR123456789')).toBeInTheDocument();
        });
    });

    it('should trigger requestTryPaymentAgentWithdraw, when all data are valid', async () => {
        render(<PaymentAgentUnlistedWithdrawForm {...props} />);

        const el_input_account_number = screen.getByLabelText('Enter the payment agent account number');
        const el_input_amount = screen.getByLabelText('Enter amount');
        const el_continue_btn = screen.getByRole('button', { name: 'Continue' });
        fireEvent.change(el_input_account_number, { target: { value: 'CR90000100' } });
        fireEvent.change(el_input_amount, { target: { value: '100' } });
        fireEvent.click(el_continue_btn);

        await waitFor(() => {
            expect(props.requestTryPaymentAgentWithdraw).toHaveBeenCalledWith({
                loginid: 'CR90000100',
                currency: 'USD',
                amount: '100',
                verification_code: 'ABCdef',
            });
        });
    });

    it('should show PaymentAgentDisclaimer in mobile view', () => {
        isMobile.mockReturnValue(true);
        render(<PaymentAgentUnlistedWithdrawForm {...props} />);

        expect(screen.getByText('PaymentAgentDisclaimer')).toBeInTheDocument();
    });
});

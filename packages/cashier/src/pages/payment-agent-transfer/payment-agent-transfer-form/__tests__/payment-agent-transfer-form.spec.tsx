import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PaymentAgentTransferForm from '../payment-agent-transfer-form';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

jest.mock('@deriv/shared/src/utils/validation/declarative-validation-rules', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    validNumber: jest.fn(() => true),
}));

describe('<PaymentAgentTransferForm />', () => {
    const balance = '80';
    const setErrorMessage = jest.fn();
    const transfer_limit = {
        min_withdrawal: '1',
        max_withdrawal: '100',
    };

    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.removeChild(modal_root_el);
    });

    it('should render the component', () => {
        render(<PaymentAgentTransferForm />);

        expect(screen.getByTestId('dt_payment_agent_transfer_form_container')).toBeInTheDocument();
    });

    it('should show an error if client login id or amount is not provided', async () => {
        render(
            <PaymentAgentTransferForm
                balance={balance}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const submit_button = screen.getByRole('button');
        fireEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid client login ID.')).toBeInTheDocument();
            expect(screen.getByText('This field is required.')).toBeInTheDocument();
        });
    });

    it('should show an error if the login id is not valid', async () => {
        render(
            <PaymentAgentTransferForm
                balance={balance}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const loginid_field = screen.getByTestId('dt_payment_agent_transfer_form_input_loginid');
        const submit_button = screen.getByRole('button');

        fireEvent.change(loginid_field, { target: { value: 'abc' } });
        fireEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid client login ID.')).toBeInTheDocument();
        });
    });

    it('should show an error if amount to be transferred is greater than the balance', async () => {
        render(
            <PaymentAgentTransferForm
                balance={balance}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const amount_field = screen.getByTestId('dt_payment_agent_transfer_form_input_amount');
        const submit_button = screen.getByRole('button');

        fireEvent.change(amount_field, { target: { value: '90' } });
        fireEvent.click(submit_button);

        await waitFor(() => {
            expect(screen.getByText('Insufficient balance.')).toBeInTheDocument();
        });
    });

    it('should show an error if description is not valid', async () => {
        render(
            <PaymentAgentTransferForm
                balance={balance}
                setErrorMessage={setErrorMessage}
                transfer_limit={transfer_limit}
            />
        );

        const description_field = screen.getByTestId('dt_payment_agent_transfer_form_input_description');
        const submit_button = screen.getByRole('button');

        fireEvent.change(description_field, { target: { value: '%' } });

        await waitFor(() => {
            expect(submit_button).toBeDisabled();
            expect(screen.getByText('Please enter a valid description.')).toBeInTheDocument();
        });
    });
});

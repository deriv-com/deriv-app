import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentTransferConfirm from '../payment-agent-transfer-confirm.jsx';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentTransferConfirm />', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const props = {
        amount: 100,
        currency: 'USD',
        description: 'description',
        transfer_to: 'CR900000101',
        error: {},
        requestPaymentAgentTransfer: jest.fn(),
        setIsTryTransferSuccessful: jest.fn(),
    };

    it('should show proper icon and message', () => {
        render(<PaymentAgentTransferConfirm {...props} />);

        expect(screen.getByTestId('dt_red_warning_icon')).toBeInTheDocument();
        expect(screen.getByText('Check transfer information')).toBeInTheDocument();
    });

    it(`setIsTryTransferSuccessful method should be triggered when click on 'Back' button`, () => {
        render(<PaymentAgentTransferConfirm {...props} />);

        const el_back_btn = screen.getByRole('button', { name: 'Back' });
        fireEvent.click(el_back_btn);

        expect(props.setIsTryTransferSuccessful).toHaveBeenCalledWith(false);
    });

    it(`requestPaymentAgentTransfer fuction should be triggered if checkbox is enabled and the "Transfer now" button is clicked`, () => {
        render(<PaymentAgentTransferConfirm {...props} />);

        const el_checkbox_transfer_consent = screen.getByRole('checkbox');
        fireEvent.click(el_checkbox_transfer_consent);
        const el_btn_transfer_now = screen.getByRole('button', { name: 'Transfer now' });
        fireEvent.click(el_btn_transfer_now);

        expect(props.requestPaymentAgentTransfer).toHaveBeenCalledWith({
            amount: 100,
            currency: 'USD',
            description: 'description',
            transfer_to: 'CR900000101',
        });
    });

    it(`should show error message`, () => {
        render(<PaymentAgentTransferConfirm {...props} error={{ code: 'error_code', message: 'error_message' }} />);

        expect(screen.getByText('error_message')).toBeInTheDocument();
    });
});

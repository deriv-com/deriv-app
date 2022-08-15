import React from 'react';
import { Money } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { fireEvent, render, screen } from '@testing-library/react';
import TransferConfirm from '../transfer-confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

let modal_root_el;

describe('<TransferConfirm />', () => {
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    const props = {
        data: [
            { key: 'pa', label: 'Payment agent', value: 'Payment Agent of CR90000561 (Created from Script)' },
            { key: 'amount', label: 'Amount', value: <Money amount='100' currency='USD' show_currency /> },
            { key: 'test', label: 'test', value: ['test1', 'test2'] },
        ],
        header: 'Please confirm the transaction details in order to complete the withdrawal:',
        onClickBack: jest.fn(),
        onClickConfirm: jest.fn(),
        warning_messages: [
            <Localize
                i18n_default_text='Remember, it’s solely your responsibility to ensure the transfer is made to the correct account.'
                key={0}
            />,
            <Localize i18n_default_text='We do not guarantee a refund if you make a wrong transfer.' key={1} />,
        ],
    };

    it('should show proper icon, header, messages and buttons', () => {
        render(<TransferConfirm {...props} />);

        expect(screen.getByTestId('dti_confirm_details_icon')).toBeInTheDocument();
        expect(
            screen.getByText('Please confirm the transaction details in order to complete the withdrawal:')
        ).toBeInTheDocument();
        expect(screen.getByText('Payment agent')).toBeInTheDocument();
        expect(screen.getByText('Payment Agent of CR90000561 (Created from Script)')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('test1')).toBeInTheDocument();
        expect(screen.getByText('test2')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should trigger onClick callback when the client clicks on Back button', () => {
        render(<TransferConfirm {...props} />);

        const el_back_btn = screen.getByRole('button', { name: 'Back' });
        fireEvent.click(el_back_btn);
        expect(props.onClickBack).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the client clicks on Confirm button', () => {
        render(<TransferConfirm {...props} />);

        const el_confirm_btn = screen.getByRole('button', { name: 'Confirm' });
        fireEvent.click(el_confirm_btn);
        expect(props.onClickConfirm).toHaveBeenCalledTimes(1);
    });

    it('should show error message', () => {
        render(<TransferConfirm {...props} error={{ message: 'Error message' }} />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should show warning messages', () => {
        render(<TransferConfirm {...props} />);

        expect(
            screen.getByText(
                'Remember, it’s solely your responsibility to ensure the transfer is made to the correct account.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('We do not guarantee a refund if you make a wrong transfer.')).toBeInTheDocument();
    });

    it('should show checkbox when is_payment_agent_transfer property is equal to true', () => {
        render(<TransferConfirm {...props} is_payment_agent_transfer />);

        expect(
            screen.getByLabelText('I confirm that I have verified the client’s transfer information.')
        ).toBeInTheDocument();
    });

    it('should enable "Transfer now" button when checkbox is checked', () => {
        render(<TransferConfirm {...props} is_payment_agent_transfer />);

        const el_checkbox_transfer_consent = screen.getByRole('checkbox');
        fireEvent.click(el_checkbox_transfer_consent);
        const el_btn_transfer_now = screen.getByRole('button', { name: 'Transfer now' });

        expect(el_btn_transfer_now).toBeEnabled();
    });
});

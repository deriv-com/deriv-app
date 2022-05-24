import React from 'react';
import { Money } from '@deriv/components';
import { fireEvent, render, screen } from '@testing-library/react';
import Confirm from '../confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<Confirm />', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
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
    };

    it('should show proper icon, header, messages and buttons', () => {
        render(<Confirm {...props} />);

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
        render(<Confirm {...props} />);

        const el_back_btn = screen.getByRole('button', { name: 'Back' });
        fireEvent.click(el_back_btn);
        expect(props.onClickBack).toHaveBeenCalledTimes(1);
    });

    it('should trigger onClick callback when the client clicks on Confirm button', () => {
        render(<Confirm {...props} />);

        const el_confirm_btn = screen.getByRole('button', { name: 'Confirm' });
        fireEvent.click(el_confirm_btn);
        expect(props.onClickConfirm).toHaveBeenCalledTimes(1);
    });

    it('should show error message', () => {
        render(<Confirm {...props} error={{ message: 'Error message' }} />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });
});

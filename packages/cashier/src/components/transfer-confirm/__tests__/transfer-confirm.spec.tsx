import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Confirm from '../confirm';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<Confirm />', () => {
    let modal_root_el;
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
            { key: '1', label: 'label 1', value: 'value 1' },
            { key: '2', label: 'label 2', value: ['value 2', 'value 3'] },
        ],
        error: {},
        onClickBack: jest.fn(),
        onClickConfirm: jest.fn(),
    };

    it('should show proper icon, messages and buttons', () => {
        render(<Confirm {...props} />);

        const [back_btn, transfer_now_btn] = screen.getAllByRole('button');

        expect(screen.getByTestId('dt_red_warning_icon')).toBeInTheDocument();
        expect(screen.getByText('label 1')).toBeInTheDocument();
        expect(screen.getByText('value 1')).toBeInTheDocument();
        expect(screen.getByText('label 2')).toBeInTheDocument();
        expect(screen.getByText('value 2')).toBeInTheDocument();
        expect(screen.getByText('value 3')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByText(/please ensure/i)).toBeInTheDocument();
        expect(screen.getByText(/all details/i)).toBeInTheDocument();
        expect(screen.getByText(/are/i)).toBeInTheDocument();
        expect(screen.getByText(/correct/i)).toBeInTheDocument();
        expect(screen.getByText(/before making your transfer/i)).toBeInTheDocument();
        expect(screen.getByText(/we/i)).toBeInTheDocument();
        expect(screen.getByText(/do not/i)).toBeInTheDocument();
        expect(screen.getByText(/guarantee a refund if you make a wrong transfer/i)).toBeInTheDocument();
        expect(back_btn).toBeInTheDocument();
        expect(transfer_now_btn).toBeInTheDocument();
    });

    it('should show error messages and button', () => {
        render(
            <Confirm
                {...props}
                error={{
                    code: 'code',
                    message: 'error_message',
                }}
            />
        );

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
        expect(screen.getByText('error_message')).toBeInTheDocument();
        expect(screen.getAllByRole('button')[2]).toBeInTheDocument();
    });

    it('should trigger onClickBack method when the client clicks on Back button', () => {
        render(<Confirm {...props} />);

        const [back_btn, _] = screen.getAllByRole('button');
        fireEvent.click(back_btn);

        expect(props.onClickBack).toHaveBeenCalledTimes(1);
    });

    it('should enable Transfer now button when checkbox is checked', () => {
        render(<Confirm {...props} />);

        const el_checkbox = screen.getByRole('checkbox');
        const [_, transfer_now_btn] = screen.getAllByRole('button');
        fireEvent.click(el_checkbox);
    });

    it('should show checkbox when is_payment_agent_transfer property is equal to true', () => {
        render(<Confirm {...props} is_payment_agent_transfer />);

        expect(
            screen.getByLabelText('I confirm that I have verified the client’s transfer information.')
        ).toBeInTheDocument();
    });

    it('should trigger onClickConfirm method when the client clicks on Transfer now button', () => {
        render(<Confirm {...props} />);

        const el_checkbox = screen.getByRole('checkbox');
        const [_, transfer_now_btn] = screen.getAllByRole('button');
        fireEvent.click(el_checkbox);
        fireEvent.click(transfer_now_btn);

        expect(props.onClickConfirm).toHaveBeenCalledTimes(1);
    });
});

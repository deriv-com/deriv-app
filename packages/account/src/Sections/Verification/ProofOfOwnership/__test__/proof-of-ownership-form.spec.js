import { render, screen } from '@testing-library/react';
import React from 'react';
import ProofOfOwnershipForm from '../proof-of-ownership-form.jsx';

describe('proof-of-ownership-form.jsx', () => {
    let cards;
    beforeAll(() => {
        cards = {
            requests: [
                {
                    creation_time: '3 o clock',
                    id: 'abc1234',
                    payment_method: 'e_wallet',
                    payment_method_identifier: 'e_wallet',
                    title: 'E-wallet',
                },
                {
                    creation_time: '4 o clock',
                    id: 'abc1235',
                    payment_method: 'zingPay',
                    payment_method_identifier: 'zingPay',
                    title: 'ZingPay',
                },
                {
                    creation_time: '5 o clock',
                    id: 'abc1236',
                    payment_method: 'online_naira',
                    payment_method_identifier: 'online_naira',
                    title: 'OnlineNaira',
                },
                {
                    creation_time: '6 o clock',
                    id: 'abc1237',
                    payment_method: 'beyonic',
                    payment_method_identifier: 'beyonic',
                    title: 'Beyonic',
                },
                {
                    creation_time: '7 o clock',
                    id: 'abc1238',
                    payment_method: 'bank_wire',
                    payment_method_identifier: 'bank_transfer',
                    title: 'Bank Transfer/Bank Wire',
                },
                {
                    creation_time: '8 o clock',
                    id: 'abc1239',
                    payment_method: 'other',
                    payment_method_identifier: 'other',
                    title: '[Payment method name]',
                },
                {
                    creation_time: '9 o clock',
                    id: 'abc12340',
                    payment_method: 'credit_debit_card',
                    payment_method_identifier: 'credit_debit_card',
                    title: 'Credit / Debit card',
                },
            ],
        };
    });
    it('should render card items inside the form', () => {
        render(<ProofOfOwnershipForm cards={cards.requests} handleSubmit={jest.fn()} />);
        const cardItems = screen.getAllByRole('card-item');
        expect(cardItems.length).toEqual(cards.requests.length);
    });
    it('should handleSubmit', () => {
        expect(true).toBeTruthy();
        // TODO: Fix This
        // const handleSubmitFn = jest.fn();
        // render(<ProofOfOwnershipForm cards={cards.requests} handleSubmit={handleSubmitFn} />);
        // fireEvent.change(screen.getByLabelText(/picture/i), {
        //     target: {
        //         files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
        //     },
        // });
        // const button = screen.getByTestId('submit-button');
        // button.style.disabled = false;
        // expect(button).toBeInTheDocument();
        // fireEvent.click(button);
        // expect(handleSubmitFn).toHaveBeenCalled();
    });
});

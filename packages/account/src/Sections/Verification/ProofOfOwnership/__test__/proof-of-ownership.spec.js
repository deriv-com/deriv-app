import { screen, render, fireEvent } from '@testing-library/react';
import ProofOfOwnership from '../proof-of-ownership.jsx';
import React from 'react';

// TODO: get requests from API call
const requests = [
    {
        creation_time: '3 o clock',
        id: 'abc1234',
        payment_method: 'E-wallet',
        payment_method_identifier: 'e_wallet',
    },
    {
        creation_time: '4 o clock',
        id: 'abc1235',
        payment_method: 'ZingPay',
        payment_method_identifier: 'zingPay',
    },
    {
        creation_time: '5 o clock',
        id: 'abc1236',
        payment_method: 'OnlineNaira',
        payment_method_identifier: 'online_naira',
    },
    {
        creation_time: '6 o clock',
        id: 'abc1237',
        payment_method: 'Beyonic',
        payment_method_identifier: 'beyonic',
    },
    {
        creation_time: '7 o clock',
        id: 'abc1238',
        payment_method: 'Bank Transfer/Bank Wire ',
        payment_method_identifier: 'bank_transfer',
    },
    {
        creation_time: '8 o clock',
        id: 'abc1239',
        payment_method: '[Payment method name]',
        payment_method_identifier: 'other',
    },
    {
        creation_time: '9 o clock',
        id: 'abc12340',
        payment_method: 'Credit / Debit card',
        payment_method_identifier: 'credit_debit_card',
    },
];

describe('proof of ownership', () => {
    it('should render proof of owndership component', () => {
        render(<ProofOfOwnership />);
        expect(screen.getByText('Please upload the following document(s).', { exact: true })).toBeInTheDocument();
        requests.forEach(req => {
            expect(screen.getByText(req.payment_method, { exact: true })).toBeInTheDocument();
        });
        const btn = screen.getByTestId('proof-of-ownership-button', { exact: true });
        expect(btn).toBeInTheDocument();
    });

    it('should render ExpandedCard on button click', () => {
        render(<ProofOfOwnership />);
        fireEvent.click(screen.getByTestId('proof-of-ownership-button', { exact: true }));
        expect(screen.getByText('Upload a photo of your', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Choose a photo', { exact: false })).toBeInTheDocument();
    });
});

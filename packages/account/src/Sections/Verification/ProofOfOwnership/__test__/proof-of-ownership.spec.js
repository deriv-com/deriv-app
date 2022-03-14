import { fireEvent, queryByAttribute, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProofOfOwnership from '../proof-of-ownership.jsx';
import React from 'react';

// TODO: get requests from API call
const ownership_temp = {
    requests: [
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
    ],
    status: 'pending',
};

describe('proof of ownership', () => {
    it('should render proof of ownership component', () => {
        render(<ProofOfOwnership ownership={ownership_temp} />);
        expect(screen.getByText('Please upload the following document(s).', { exact: true })).toBeInTheDocument();
        ownership_temp.requests.forEach(req => {
            expect(screen.getByTestId(req.id, { exact: true })).toBeInTheDocument();
        });
        const arrowButtons = screen.getAllByTestId('proof-of-ownership-button', { exact: true });
        expect(arrowButtons.length).toEqual(ownership_temp.requests.length);
    });

    it('should render ExpandedCard on button click', () => {
        render(<ProofOfOwnership ownership={ownership_temp} />);
        const elements = screen.getAllByTestId('proof-of-ownership-button', { exact: true });

        ownership_temp.requests.forEach((req, index) => {
            fireEvent.click(elements[index]);
            const { getByText } = within(screen.getAllByTestId(req.id)[0]);
            expect(getByText('Upload a photo of your', { exact: false })).toBeInTheDocument();
            expect(getByText('Choose a photo', { exact: false })).toBeInTheDocument();
        });
    });
    it('should render second step on click next', () => {
        render(<ProofOfOwnership />);
        expect(screen.getByTestId('next-button', { exact: true }))
            .toBeInTheDocument()
            .toBeDisabled();

        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        const element = screen.getAllByTestId('proof-of-ownership-button', { exact: true });
        ownership_temp.requests.forEach((req, index) => {
            fireEvent.click(element[index]);
            const { getByText } = within(screen.getAllByTestId(req.id)[0]);
            expect(getByText('Upload a photo of your', { exact: false })).toBeInTheDocument();
            expect(getByText('Choose a photo', { exact: false })).toBeInTheDocument();
            const image_uploader = screen.getByTestId(`uploader-${req.id}`);
            userEvent.upload(image_uploader, file);
        });
        expect(screen.getByTestId('next-button', { exact: true }))
            .toBeInTheDocument()
            .toBeEnabled();
    });
    it('should render example modal for each card', () => {
        const getById = queryByAttribute.bind(null, 'id');
        const { container } = render(<ProofOfOwnership ownership={ownership_temp} />);
        const element = screen.getAllByTestId('proof-of-ownership-button', { exact: true });
        ownership_temp.requests.forEach(async (req, index) => {
            fireEvent.click(element[index]);
            const { getByText } = within(screen.getAllByTestId(req.id)[0]);
            expect(getByText('See example', { exact: true })).toBeInTheDocument();
            const example = getByText('See example', { exact: true });
            fireEvent.click(example);
            expect(screen.getByAltText('creditcardsample', { exact: true })).toBeInTheDocument();
            await waitFor(() => {
                const modal = getById(container, 'modal_root');
                // eslint-disable-next-line testing-library/prefer-screen-queries
                fireEvent.click(modal.getByRole('button'));
            });
        });
    });
});

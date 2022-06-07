import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProofOfOwnership } from '../proof-of-ownership.jsx';

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
describe('proof-of-ownership.jsx', () => {
    it('should render no poo required status page', async () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'none' },
                    },
                }}
            />
        );
        const element = screen.getByText('Proof of ownership not required.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo verified status page', async () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'verified' },
                    },
                }}
            />
        );
        const element = screen.getByText('Proof of ownership verification passed.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo submitted status page', async () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'pending' },
                    },
                }}
            />
        );
        const element = screen.getByText('We’ve received your proof of ownership.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo rejected status page', async () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'rejected' },
                    },
                }}
            />
        );
        const element = screen.getByText('Proof of ownership verification failed', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render ProofOfOwnershipForm', async () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: ownership_temp.requests, status: ownership_temp.status },
                    },
                }}
            />
        );
        expect(screen.getByTestId(ownership_temp.requests[0].id, { exact: true })).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProofOfOwnership } from '../proof-of-ownership.jsx';
import testData from './test-data';

describe('proof-of-ownership.jsx', () => {
    let ownership_temp;
    beforeAll(() => {
        ownership_temp = testData;
    });
    it('should render no poo required status page', () => {
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
    it('should render poo verified status page', () => {
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
    it('should render poo submitted status page', () => {
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
    it('should render ProofOfOwnershipForm', () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: ownership_temp.requests, status: ownership_temp.status },
                        needs_verification: ['ownership'],
                    },
                }}
            />
        );
        expect(screen.getByTestId(ownership_temp.requests[0].id, { exact: true })).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProofOfOwnership } from '../proof-of-ownership.jsx';
import test_data from './test-data';

describe('proof-of-ownership.jsx', () => {
    let ownership_temp;
    beforeAll(() => {
        ownership_temp = test_data;
    });
    it('should render no poo required status page', () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'none' },
                    },
                }}
                updateAccountStatus={jest.fn()}
            />
        );
        const element = screen.getByText("Your proof of ownership isn't required.", { exact: true });
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
                updateAccountStatus={jest.fn()}
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
                updateAccountStatus={jest.fn()}
            />
        );
        const element = screen.getByText('We’ve received your proof of ownership.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo rejected status page', () => {
        render(
            <ProofOfOwnership
                account_status={{
                    authentication: {
                        ownership: { requests: [], status: 'rejected' },
                    },
                }}
                updateAccountStatus={jest.fn()}
            />
        );
        const element = screen.getByTestId('dt_try-again-button', { exact: true });
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
                updateAccountStatus={jest.fn()}
            />
        );
        expect(screen.getByTestId('dt_poo_form', { exact: true })).toBeInTheDocument();
    });
});

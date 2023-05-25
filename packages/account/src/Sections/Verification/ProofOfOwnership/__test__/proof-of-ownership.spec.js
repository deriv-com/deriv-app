import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProofOfOwnership } from '../proof-of-ownership.jsx';
import test_data from './test-data';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('proof-of-ownership.jsx', () => {
    let ownership_temp;
    beforeAll(() => {
        ownership_temp = test_data;
    });
    const ProofOfOwnershipScreen = () => {
        return (
            <StoreProvider store={store}>
                <ProofOfOwnership />
            </StoreProvider>
        );
    };
    let store = mockStore();
    it('should render no poo required status page', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: [], status: 'none' },
                    },
                },
            },
        });
        render(<ProofOfOwnershipScreen />);

        const element = screen.getByText("Your proof of ownership isn't required.", { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo verified status page', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: [], status: 'verified' },
                    },
                },
            },
        });
        render(<ProofOfOwnershipScreen />);

        const element = screen.getByText('Proof of ownership verification passed.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo submitted status page', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: [], status: 'pending' },
                    },
                },
            },
        });
        render(<ProofOfOwnershipScreen />);

        const element = screen.getByText('We’ve received your proof of ownership.', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render poo rejected status page', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: [], status: 'rejected' },
                    },
                },
            },
        });
        render(<ProofOfOwnershipScreen />);

        const element = screen.getByTestId('dt_try-again-button', { exact: true });
        expect(element).toBeInTheDocument();
    });
    it('should render ProofOfOwnershipForm', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: ownership_temp.requests, status: ownership_temp.status },
                        needs_verification: ['ownership'],
                    },
                },
            },
        });
        render(<ProofOfOwnershipScreen />);
        expect(screen.getByTestId('dt_poo_form', { exact: true })).toBeInTheDocument();
    });
});

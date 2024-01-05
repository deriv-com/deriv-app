import React from 'react';
import { render, screen } from '@testing-library/react';
import { GetAccountStatus } from '@deriv/api-types';
import { StoreProvider, mockStore } from '@deriv/stores';
import { ProofOfOwnership } from '../proof-of-ownership';
import test_data from './test-data';

type TRequests = DeepRequired<GetAccountStatus>['authentication']['ownership']['requests'];
type TStatus = DeepRequired<GetAccountStatus>['authentication']['ownership']['status'];

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useFileUploader: jest.fn(() => ({
        upload: jest.fn(),
    })),
}));

describe('proof-of-ownership.jsx', () => {
    let ownership_temp: typeof test_data;

    beforeAll(() => {
        ownership_temp = test_data;
    });
    let store = mockStore({});
    const ProofOfOwnershipScreen = () => {
        return (
            <StoreProvider store={store}>
                <ProofOfOwnership />
            </StoreProvider>
        );
    };
    it('should render no poo required status page', () => {
        store = mockStore({
            client: {
                account_status: {
                    authentication: {
                        ownership: { requests: [], status: 'none' },
                    },
                },
                account_settings: {
                    citizen: 'id',
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
                account_settings: {
                    citizen: 'id',
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
                account_settings: {
                    citizen: 'id',
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
                account_settings: {
                    citizen: 'id',
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
                        ownership: {
                            requests: ownership_temp.requests as TRequests,
                            status: ownership_temp.status as TStatus,
                        },
                        needs_verification: ['ownership'],
                    },
                },
                account_settings: {
                    citizen: 'id',
                },
            },
        });
        render(<ProofOfOwnershipScreen />);
        expect(screen.getByTestId('dt_poo_form', { exact: true })).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsList from '../DocumentsList';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockHistoryPush,
    })),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    ClientVerificationStatusBadge: jest.fn(({ variant }) => variant),
}));

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    DocumentTile: jest.fn(({ badge, isDisabled, onClick, title }) => (
        <button disabled={isDisabled} onClick={onClick}>
            {title}
            <div>{badge}</div>
        </button>
    )),
}));

describe('<DocumentsList />', () => {
    it('poa tile is not rendered', () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'none',
                        valid_tin: 1,
                    },
                }}
            />
        );

        expect(screen.queryByText('Proof of identity')).not.toBeInTheDocument();
    });

    it('poi tile is not rendered', () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poi_status: 'none',
                        valid_tin: 1,
                    },
                }}
            />
        );

        expect(screen.queryByText('Proof of address')).not.toBeInTheDocument();
    });

    it('`Additional information` tile is not rendered', () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'none',
                        poi_status: 'none',
                    },
                }}
            />
        );

        expect(screen.queryByText('Additional information')).not.toBeInTheDocument();
    });

    it('on click poi tile redirects to correct page', async () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poi_status: 'none',
                    },
                }}
            />
        );

        const poiTile = screen.getByText('Proof of identity');
        userEvent.click(poiTile);

        await waitFor(() => {
            expect(mockHistoryPush).toBeCalledWith('/account/proof-of-identity');
        });
    });

    it('on click poa tile redirects to correct page', async () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'none',
                    },
                }}
            />
        );

        const poaTile = screen.getByText('Proof of address');
        userEvent.click(poaTile);

        await waitFor(() => {
            expect(mockHistoryPush).toBeCalledWith('/account/proof-of-address');
        });
    });

    it('on click `Additional information` tile redirects to correct page', async () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        required_tin: 1,
                        valid_tin: 0,
                    },
                }}
            />
        );

        const additionalInfoTile = screen.getByText('Additional information');
        userEvent.click(additionalInfoTile);

        await waitFor(() => {
            expect(mockHistoryPush).toBeCalledWith('/account/personal-details');
        });
    });

    it('renders poi tile with correct badge', () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poi_status: 'verified',
                    },
                }}
            />
        );

        const poiTile = screen.getByText('Proof of identity');

        expect(within(poiTile).getByText('verified')).toBeInTheDocument;
    });

    it('renders poa tile with correct badge', () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'verified',
                    },
                }}
            />
        );

        const poaTile = screen.getByText('Proof of address');

        expect(within(poaTile).getByText('verified')).toBeInTheDocument;
    });
});

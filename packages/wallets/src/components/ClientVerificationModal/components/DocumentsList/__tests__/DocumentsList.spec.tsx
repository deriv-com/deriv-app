import React from 'react';
import { useActiveWalletAccount, useGrowthbookGetFeatureValue } from '@deriv/api-v2';
import { ACCOUNTS_OS_POA_URL, ACCOUNTS_OS_POI_STATUS_URL, ACCOUNTS_OS_POI_URL } from '@deriv/shared';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsList from '../DocumentsList';

const mockHistoryPush = jest.fn();
const mockLocationReplace = jest.fn();
const mockLocalStorage = {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
};

// Mock the window.location.replace function
Object.defineProperty(window, 'location', {
    value: {
        ...window.location,
        replace: mockLocationReplace,
    },
    writable: true,
});

beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
    });

    // Reset mocks
    mockHistoryPush.mockReset();
    mockLocationReplace.mockReset();
    mockLocalStorage.setItem.mockReset();

    // Default mock for useGrowthbookGetFeatureValue
    (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { loginid: '123' } });
    (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockHistoryPush,
    })),
}));

// Mock the API hooks
jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({ data: { loginid: '123' } })),
    useGrowthbookGetFeatureValue: jest.fn(() => [false, true]),
}));

jest.mock('../../../../ClientVerificationBadge', () => ({
    ...jest.requireActual('../../../../ClientVerificationBadge'),
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

    it('on click poi tile redirects to correct page when feature flag is disabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);

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
        await userEvent.click(poiTile);

        await waitFor(() => {
            expect(mockHistoryPush).toBeCalledWith('/account/proof-of-identity');
            expect(mockLocationReplace).not.toBeCalled();
        });
    });

    it('on click poi tile redirects to accounts OS app when feature flag is enabled and poi_status is none', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

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
        await userEvent.click(poiTile);

        await waitFor(() => {
            expect(mockLocationReplace).toBeCalled();
            // Check that the URL contains the POI URL for new submissions
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POI_URL);
            expect(mockHistoryPush).not.toBeCalled();
        });
    });

    it('on click poi tile redirects to accounts OS status page when feature flag is enabled and poi_status is not none', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poi_status: 'pending',
                    },
                }}
            />
        );

        const poiTile = screen.getByText('Proof of identity');
        await userEvent.click(poiTile);

        await waitFor(() => {
            expect(mockLocationReplace).toBeCalled();
            // Check that the URL contains the POI status URL for existing submissions
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POI_STATUS_URL);
            expect(mockHistoryPush).not.toBeCalled();
        });
    });

    it('on click poa tile redirects to correct page when feature flag is disabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);

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
        await userEvent.click(poaTile);

        await waitFor(() => {
            expect(mockHistoryPush).toBeCalledWith('/account/proof-of-address');
            expect(mockLocationReplace).not.toBeCalled();
        });
    });

    it('on click poa tile redirects to accounts OS app when feature flag is enabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

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
        await userEvent.click(poaTile);

        await waitFor(() => {
            expect(mockLocationReplace).toBeCalled();
            // Check that the URL contains the POA URL
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POA_URL);
            expect(mockHistoryPush).not.toBeCalled();
        });
    });

    it('sets localStorage when account platform is mt5', async () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'verified',
                    },
                    platform: 'mt5',
                }}
            />
        );

        const poaTile = screen.getByText('Proof of address');
        await userEvent.click(poaTile);

        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mt5_poa_status', 'verified');
        });
    });

    it('does not set localStorage when account platform is not mt5', async () => {
        render(
            <DocumentsList
                account={{
                    // @ts-expect-error - since this is a mock, we only need partial properties of the account
                    client_kyc_status: {
                        poa_status: 'verified',
                    },
                    // Using a different platform that's not mt5
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    platform: 'dxtrade' as any,
                }}
            />
        );

        const poaTile = screen.getByText('Proof of address');
        await userEvent.click(poaTile);

        await waitFor(() => {
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
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
        await userEvent.click(additionalInfoTile);

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

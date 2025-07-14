import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListItem from '../ListItem';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated, useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { AUTH_STATUS_CODES, ACCOUNTS_OS_POI_URL, ACCOUNTS_OS_POI_STATUS_URL, ACCOUNTS_OS_POA_URL } from '@deriv/shared';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

const mockHistoryPush = jest.fn();
const mockLocationReplace = jest.fn();
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
};

// Mock window.location.replace
Object.defineProperty(window, 'location', {
    value: {
        ...window.location,
        replace: mockLocationReplace,
    },
    writable: true,
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetStatus: jest.fn(),
    useIsSelectedMT5AccountCreated: jest.fn(),
    useGrowthbookGetFeatureValue: jest.fn(() => [false, true]),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightUploadPoiIcon: () => <div>DerivLightUploadPoiIcon</div>,
    LabelPairedChevronRightMdRegularIcon: () => <div>LabelPairedChevronRightMdRegularIcon</div>,
    DerivLightWaitingPoaIcon: () => <div>DerivLightWaitingPoaIcon</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    StatusBadge: () => <div>StatusBadge</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    AUTH_STATUS_CODES: {
        VERIFIED: 'verified',
        PENDING: 'pending',
        REJECTED: 'rejected',
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
        location: { search: 'test' },
    }),
}));

describe('<ListItem />', () => {
    const mockSetVerificationModalOpen = jest.fn();
    const mockSetFieldRefToFocus = jest.fn();

    const defaultStore = mockStore({
        traders_hub: {
            setVerificationModalOpen: mockSetVerificationModalOpen,
        },
        common: {
            platform: 'mt5',
            is_from_tradershub_os: false,
        },
        client: {
            getToken: jest.fn(() => 'mock-token'),
        },
        ui: {
            setFieldRefToFocus: mockSetFieldRefToFocus,
        },
    });

    const renderComponent = (props: { id: string; text: string; status: string; route: string }) => {
        render(
            <StoreProvider store={defaultStore}>
                <ListItem {...props} />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useGetStatus as jest.Mock).mockReturnValue({
            client_kyc_status: { poi_status: 'verified', poa_status: 'verified', valid_tin: 'verified' },
        });
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValue({ is_selected_MT5_account_created: true });
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);
    });

    it('should render verified status', () => {
        const props = {
            id: 'identity',
            text: 'Verified',
            status: AUTH_STATUS_CODES.VERIFIED,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('Verified')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });

    it('should render pending status', () => {
        const props = {
            id: 'identity',
            text: 'In review',
            status: AUTH_STATUS_CODES.PENDING,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('In review')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });

    it('should render with Failed status', () => {
        const props = {
            id: 'identity',
            text: 'Failed',
            status: AUTH_STATUS_CODES.REJECTED,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        expect(screen.getByText('Failed')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightMdRegularIcon')).toBeInTheDocument();
    });

    it('should redirect to identity page when feature flag is disabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);

        const props = {
            id: 'identity',
            text: 'Identity',
            status: 'none',
            route: '/proof_of_identity',
        };
        renderComponent(props);

        const identityItem = screen.getByText('Identity');
        fireEvent.click(identityItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockHistoryPush).toHaveBeenCalledWith('/proof_of_identity');
            expect(mockLocationReplace).not.toHaveBeenCalled();
        });
    });

    it('should redirect to accounts OS app for identity when feature flag is enabled and status is none', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

        const props = {
            id: 'identity',
            text: 'Identity',
            status: 'none',
            route: '/proof_of_identity',
        };
        renderComponent(props);

        const identityItem = screen.getByText('Identity');
        fireEvent.click(identityItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockLocationReplace).toHaveBeenCalled();
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POI_URL);
            expect(mockHistoryPush).not.toHaveBeenCalled();
        });
    });

    it('should redirect to accounts OS status page for identity when feature flag is enabled and status is not none', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

        const props = {
            id: 'identity',
            text: 'Identity',
            status: 'pending',
            route: '/proof_of_identity',
        };
        renderComponent(props);

        const identityItem = screen.getByText('Identity');
        fireEvent.click(identityItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockLocationReplace).toHaveBeenCalled();
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POI_STATUS_URL);
            expect(mockHistoryPush).not.toHaveBeenCalled();
        });
    });

    it('should set localStorage and redirect to address page when feature flag is disabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([false, true]);

        const props = {
            id: 'address',
            text: 'Address',
            status: 'none',
            route: '/proof_of_address',
        };
        renderComponent(props);

        const addressItem = screen.getByText('Address');
        fireEvent.click(addressItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mt5_poa_status', 'none');
            expect(mockHistoryPush).toHaveBeenCalledWith('/proof_of_address');
            expect(mockLocationReplace).not.toHaveBeenCalled();
        });
    });

    it('should set localStorage and redirect to accounts OS app for address when feature flag is enabled', async () => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);

        const props = {
            id: 'address',
            text: 'Address',
            status: 'none',
            route: '/proof_of_address',
        };
        renderComponent(props);

        const addressItem = screen.getByText('Address');
        fireEvent.click(addressItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('mt5_poa_status', 'none');
            expect(mockLocationReplace).toHaveBeenCalled();
            expect(mockLocationReplace.mock.calls[0][0]).toContain(ACCOUNTS_OS_POA_URL);
            expect(mockHistoryPush).not.toHaveBeenCalled();
        });
    });

    it('should not do anything when document is verified', async () => {
        const props = {
            id: 'identity',
            text: 'Identity',
            status: AUTH_STATUS_CODES.VERIFIED,
            route: '/proof_of_identity',
        };
        renderComponent(props);

        const identityItem = screen.getByText('Identity');
        fireEvent.click(identityItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).not.toHaveBeenCalled();
            expect(mockHistoryPush).not.toHaveBeenCalled();
            expect(mockLocationReplace).not.toHaveBeenCalled();
        });
    });

    it('should set field ref to focus for tax information', async () => {
        const props = {
            id: 'tax',
            text: 'Tax information',
            status: 'none',
            route: '/personal_details',
        };
        renderComponent(props);

        const taxItem = screen.getByText('Tax information');
        fireEvent.click(taxItem);

        await waitFor(() => {
            expect(mockSetVerificationModalOpen).toHaveBeenCalledWith(false);
            expect(mockSetFieldRefToFocus).toHaveBeenCalledWith('employment-tax-section');
            expect(mockHistoryPush).toHaveBeenCalledWith('/personal_details');
        });
    });
});

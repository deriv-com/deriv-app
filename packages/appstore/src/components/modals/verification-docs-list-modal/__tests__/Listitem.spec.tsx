import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListItem from '../ListItem'; // Adjust the import path as necessary
import { useStore, StoreProvider, mockStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetStatus: jest.fn(),
    useIsSelectedMT5AccountCreated: jest.fn(),
}));

jest.mock('@deriv/quill-icons', () => ({
    LabelPairedChevronRightCaptionBoldIcon: () => <div>LabelPairedChevronRightCaptionBoldIcon </div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    StatusBadge: () => <div>StatusBadge</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    AUTH_STATUS_CODES: { VERIFIED: 'verified' },
}));
const mockFn = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
        location: { search: 'test' },
        replace: mockFn,
    }),
}));

describe('<ListItem />', () => {
    const defaultStore = mockStore({
        traders_hub: {
            toggleVerificationModal: jest.fn(),
        },
        common: {
            platform: 'mt5',
        },
    });

    const defaultProps = {
        id: 'identity',
        text: 'Verified',
        status: 'verified',
        route: '/proof_of_identity',
    };

    const rendercomponent = ({ props = defaultProps, store = defaultStore }) => {
        render(
            <StoreProvider store={store}>
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
    });

    it('should render the list item', () => {
        rendercomponent({ props: defaultProps });

        expect(screen.getByText('Verified')).toBeInTheDocument();
        expect(screen.getByText('StatusBadge')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedChevronRightCaptionBoldIcon')).toBeInTheDocument();
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useGetStatus, useIsSelectedMT5AccountCreated } from '@deriv/hooks';
import VerificationDocsListModal from '../verification-docs-list-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useGetStatus: jest.fn(() => ({
        client_kyc_status: { poi_status: 'rejected', poa_status: 'verified', valid_tin: 1 },
    })),
    useIsSelectedMT5AccountCreated: jest.fn(() => ({ is_selected_MT5_account_created: true })),
}));

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    DerivLightUploadPoiIcon: () => <div>DerivLightUploadPoiIcon</div>,
    LabelPairedChevronRightCaptionBoldIcon: () => <div>LabelPairedChevronRightCaptionBoldIcon</div>,
    DerivLightWaitingPoaIcon: () => <div>DerivLightWaitingPoaIcon</div>,
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    StatusBadge: () => <div>StatusBadge</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    CFD_PLATFORMS: { MT5: 'mt5' },
}));

describe('<VerificationDocsListModal />', () => {
    const defaultstore = mockStore({
        traders_hub: {
            is_verification_docs_list_modal_visible: true,
            setVerificationModalOpen: jest.fn(),
        },
        common: {
            platform: 'mt5',
        },
    });
    const renderComponent = ({ store = defaultstore }) => {
        render(
            <StoreProvider store={store}>
                <VerificationDocsListModal />
            </StoreProvider>
        );
    };
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the modal', () => {
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValueOnce({ is_selected_MT5_account_created: true });
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: false });
        (useGetStatus as jest.Mock).mockReturnValueOnce({
            client_kyc_status: {
                poi_status: 'none',
                poa_status: 'verified',
                valid_tin: 1,
            },
        });
        renderComponent({});
        expect(screen.getByText('Verify your account')).toBeInTheDocument();
    });

    it('should show the DerivLightUploadPoiIcon and text', () => {
        (useIsSelectedMT5AccountCreated as jest.Mock).mockReturnValueOnce({ is_selected_MT5_account_created: true });
        renderComponent({});
        expect(screen.getByText('DerivLightUploadPoiIcon')).toBeInTheDocument();
        expect(screen.getByText('Your account needs verification.')).toBeInTheDocument();
    });
});

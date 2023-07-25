import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LinkExpiredModal from '../link-expired-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import { APIProvider, useRequest } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

// @ts-expect-error ignore this until find a way to make arguments as partial
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'verify_email'>>;

describe('LinkExpiredModal', () => {
    const renderModal = (mock_store_override = {}) => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore(mock_store_override);
        return render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
    };

    it('should render the component when is_link_expired_modal_visible is true', () => {
        renderModal({ ui: { is_link_expired_modal_visible: true } });
        expect(screen.queryByText('Link Expired')).toBeInTheDocument();
    });

    it('should not render the component when is_link_expired_modal_visible is false', () => {
        renderModal();
        expect(screen.queryByText('Link Expired')).not.toBeInTheDocument();
    });
});

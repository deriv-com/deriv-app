import React from 'react';
import EffortlessLoginModal from '../effortless-login-modal';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useShowEffortlessLoginModal } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useShowEffortlessLoginModal: jest.fn(() => false),
}));

jest.mock('../effortless-login-content', () => jest.fn(() => <div>Effortless Content</div>));

const mockUseShowEffortlessLoginModal = useShowEffortlessLoginModal as jest.MockedFunction<
    typeof useShowEffortlessLoginModal
>;

describe('EffortlessLoginModal', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);

    const mock_store = mockStore({});

    it('should not render EffortlessLoginModal', () => {
        render(
            <StoreProvider store={mock_store}>
                <EffortlessLoginModal />
            </StoreProvider>
        );
        expect(screen.queryByText('Effortless Content')).not.toBeInTheDocument();
    });

    it('should render EffortlessLoginModal', () => {
        mockUseShowEffortlessLoginModal.mockReturnValue(true);
        render(
            <StoreProvider store={mock_store}>
                <EffortlessLoginModal />
            </StoreProvider>
        );
        expect(screen.getByText('Effortless Content')).toBeInTheDocument();
    });
});

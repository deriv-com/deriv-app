import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UrlUnavailableModal from '../url-unavailable-modal';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('<UrlUnavailableModal />', () => {
    let modalRootEl: HTMLDivElement;

    beforeAll(() => {
        modalRootEl = document.createElement('div');
        modalRootEl.setAttribute('id', 'modal_root');
        document.body.appendChild(modalRootEl);
    });

    afterAll(() => {
        document.body.removeChild(modalRootEl);
    });

    const modalHeading = /The URL you requested/i;
    const modalInfo = /This could be because:/i;
    const okButtonName = 'OK';

    const store = mockStore({
        ui: { isUrlUnavailableModalVisible: true },
    });
    const renderComponent = () =>
        render(
            <StoreProvider store={store}>
                <UrlUnavailableModal />
            </StoreProvider>
        );

    it('should render UrlUnavailableModal if isUrlUnavailableModalVisible is true', () => {
        renderComponent();
        expect(screen.getByRole('heading', { name: modalHeading })).toBeInTheDocument();
        expect(screen.getByText(modalInfo)).toBeInTheDocument();

        const redirectLink = screen.getByRole('link', { name: /Explore our website/i });
        expect(redirectLink).toBeInTheDocument();

        const okButton = screen.getByRole('button', { name: okButtonName });
        expect(okButton).toBeInTheDocument();
        expect(okButton).toBeEnabled();
    });
    it('should call toggleUrlUnavailableModal when OK button is clicked', () => {
        const toggleUrlUnavailableModal = jest.fn();
        store.ui.toggleUrlUnavailableModal = toggleUrlUnavailableModal;
        renderComponent();
        const okButton = screen.getByRole('button', { name: okButtonName });
        userEvent.click(okButton);
        expect(toggleUrlUnavailableModal).toBeCalledTimes(1);
    });
    it('should not render the component if isUrlUnavailableModalVisible is false', () => {
        store.ui.isUrlUnavailableModalVisible = false;
        renderComponent();
        expect(screen.queryByRole('heading', { name: modalHeading })).not.toBeInTheDocument();
        expect(screen.queryByText(modalInfo)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: okButtonName })).not.toBeInTheDocument();
    });
});

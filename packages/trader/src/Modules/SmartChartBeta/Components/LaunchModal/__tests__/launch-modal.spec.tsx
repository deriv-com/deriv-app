import * as React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import LaunchModal from '../launch-modal';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Launch Modal', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        // To clear localStorage on each test run
        localStorage.removeItem('launchModalShown');
    });

    it('should display launch modal for a logged in user', async () => {
        const mocked_store = mockStore({
            client: { is_logged_in: true },
        });

        render(
            <StoreProvider store={mocked_store}>
                <LaunchModal />
            </StoreProvider>
        );
        expect(screen.getByTestId('launch-modal')).toBeInTheDocument();
    });

    it('should not display launch modal for a not logged in user', async () => {
        const mocked_store = mockStore({
            client: { is_logged_in: false },
        });

        render(
            <StoreProvider store={mocked_store}>
                <LaunchModal />
            </StoreProvider>
        );
        expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
    });

    it('should set the localStorage key launchModalShown to true on clicking the continue button', async () => {
        const mocked_store = mockStore({
            client: { is_logged_in: true },
        });
        render(
            <StoreProvider store={mocked_store}>
                <LaunchModal />
            </StoreProvider>
        );
        const continueBtn = screen.getByRole('button', { name: 'Continue' });
        userEvent.click(continueBtn);
        const value = JSON.parse(localStorage.getItem('launchModalShown') || 'false');
        expect(value).toBe(true);
    });

    it('should close the launch modal on clicking the continue button', async () => {
        const mocked_store = mockStore({
            client: { is_logged_in: true },
        });
        render(
            <StoreProvider store={mocked_store}>
                <LaunchModal />
            </StoreProvider>
        );
        const continueBtn = screen.getByRole('button', { name: 'Continue' });
        userEvent.click(continueBtn);
        await waitFor(() => {
            expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
        });
    });

    it('should not show the launch modal once localStorage launchModalShown is set', async () => {
        const mocked_store = mockStore({
            client: { is_logged_in: true },
        });

        localStorage.setItem('launchModalShown', JSON.stringify(true));
        render(
            <StoreProvider store={mocked_store}>
                <LaunchModal />
            </StoreProvider>
        );
        await waitFor(() => {
            expect(screen.queryByTestId('launch-modal')).not.toBeInTheDocument();
        });
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TourEndDialog from '../tour-end-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Tour End Dialog', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('render TourEndDialog component for bot builder tour', () => {
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_DBot_store.dashboard.setTourDialogVisibility(true);

        render(<TourEndDialog />, { wrapper });
        expect(screen.getByText('Congratulations')).toBeInTheDocument();
    });

    it('render TourEndDialog component to have title with text size xs', () => {
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_DBot_store.dashboard.setTourDialogVisibility(true);

        render(<TourEndDialog />, { wrapper });

        const title = screen.getByText('Congratulations');
        expect(title).toHaveStyle('--text-size: var(--text-size-xs)');
        expect(screen.getByTestId('tour-success-message')).toBeInTheDocument();
    });

    it('render TourEndDialog component to have title with text size s on desktop', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_DBot_store.dashboard.setTourDialogVisibility(true);

        render(<TourEndDialog />, { wrapper });

        const title = screen.getByText('Congratulations');
        expect(title).toHaveStyle('--text-size: var(--text-size-s)');
        expect(screen.getByTestId('tour-success-message')).toBeInTheDocument();
    });

    it('render TourEndDialog component to be closed for bot builder tour after clicking OK', () => {
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_DBot_store.dashboard.setTourDialogVisibility(true);

        render(<TourEndDialog />, { wrapper });
        const start_button = screen.getByRole('button', { name: 'OK' });
        userEvent.click(start_button);

        expect(mock_DBot_store.dashboard.is_tour_dialog_visible).toBeFalsy();
    });
});

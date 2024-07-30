import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TourStartDialog from '../tour-start-dialog';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Tour Start Dialog', () => {
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

    it('render TourStartDialog component for onboarding tour', () => {
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.DASHBOARD);

        render(<TourStartDialog />, { wrapper });
        expect(screen.getByText('Get started on Deriv Bot')).toBeInTheDocument();
    });

    it('render TourStartDialog component for bot builder tour in mobile', () => {
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });
        expect(screen.getByText('Bot Builder guide')).toBeInTheDocument();
    });

    it('render TourStartDialog component for bot builder tour in desktop', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });
        expect(screen.getByText("Let's build a Bot!")).toBeInTheDocument();
    });

    it('render TourStartDialog component with active tour as bot builder and dialog closed when clicking start', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });

        const start_button = screen.getByRole('button', { name: 'Start' });
        userEvent.click(start_button);
        expect(mock_DBot_store.dashboard.active_tour).toEqual('bot_builder');
        expect(mock_DBot_store.dashboard.is_tour_dialog_visible).toBeFalsy();
    });

    it('render TourStartDialog component with show_mobile_tour_dialog as false when clicking start in mobile', () => {
        mock_store.ui.is_desktop = false;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });

        const start_button = screen.getByRole('button', { name: 'Start' });
        userEvent.click(start_button);
        expect(mock_DBot_store.dashboard.show_mobile_tour_dialog).toBeFalsy();
    });

    it('render TourStartDialog component with dialog closed when clicking skip', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });

        const start_button = screen.getByRole('button', { name: 'Skip' });
        userEvent.click(start_button);
        expect(mock_DBot_store.dashboard.is_tour_dialog_visible).toBeFalsy();
    });

    it('render TourStartDialog component with show_mobile_tour_dialog as false when clicking skip in mobile', () => {
        mock_store.ui.is_desktop = false;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<TourStartDialog />, { wrapper });

        const start_button = screen.getByRole('button', { name: 'Skip' });
        userEvent.click(start_button);
        expect(mock_DBot_store.dashboard.show_mobile_tour_dialog).toBeFalsy();
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { getSetting } from 'Utils/settings';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import OnboardingTourDesktop from '../onboarding-tour-desktop';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('Utils/settings', () => ({
    getSetting: jest.fn(),
}));

describe('Onboarding Tour Desktop', () => {
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

    it('should render OnboardingTourDesktop component', () => {
        render(<OnboardingTourDesktop />, {
            wrapper,
        });

        expect(screen.getByText('Get started on Deriv Bot')).toBeInTheDocument();
    });

    it('should render Onboarding tour when no onboarding token and active tab is 0', () => {
        (getSetting as jest.Mock).mockReturnValueOnce(null);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.DASHBOARD);

        render(<OnboardingTourDesktop />, {
            wrapper,
        });

        expect(mock_DBot_store.dashboard.is_tour_dialog_visible).toBeTruthy();
    });

    it('should render ReactJoyrideWrapper when there is an active tour', () => {
        render(<OnboardingTourDesktop />, {
            wrapper,
        });

        mock_DBot_store.dashboard.setActiveTour('onboarding');
        expect(screen.getByText('Get started on Deriv Bot')).toBeInTheDocument();
    });

    it('should not render Onboarding tour when token is set and active tab is not 0', () => {
        (getSetting as jest.Mock).mockReturnValueOnce('onboarding_tour_token');
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<OnboardingTourDesktop />, {
            wrapper,
        });

        expect(screen.queryByText('Get started on Deriv Bot')).not.toBeInTheDocument();
    });
});

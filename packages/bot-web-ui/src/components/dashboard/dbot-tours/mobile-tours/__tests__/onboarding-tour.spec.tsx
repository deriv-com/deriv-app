import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import OnboardingTour from '../onboarding-tour';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('<OnboardingTour />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders onboarding tour', () => {
        const { container } = render(<OnboardingTour />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('shows the tour content when tour starts', () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const tourElement = screen.getByTestId('onboarding-tour-mobile');
        expect(tourElement).toHaveClass('dbot-slider--active');
    });

    it('calls onCloseTour when Exit Tour is clicked', () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const exitTourButton = screen.getByTestId('exit-onboard-tour');
        act(() => {
            userEvent.click(exitTourButton);
        });
        expect(mock_DBot_store?.dashboard.has_started_onboarding_tour).toBe(false);
    });

    it('calls onCloseTour when Skip is clicked', () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const skipTourButton = screen.getByTestId('skip-onboard-tour');
        act(() => {
            userEvent.click(skipTourButton);
        });
        expect(mock_DBot_store?.dashboard.has_started_onboarding_tour).toBe(false);
    });

    it('Check if next button is clicked', async () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-onboard-tour');
        if (!nextButton) {
            /* eslint-disable no-console */
            console.error('Next button not found. Make sure it exists in your component.');
        }
        const onClickMock = jest.fn();
        nextButton.onclick = onClickMock;
        act(() => {
            userEvent.click(nextButton);
        });
        await waitFor(() => {
            expect(onClickMock).toHaveBeenCalledTimes(1);
        });
    });

    it('should check Previous button is clicked', async () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-onboard-tour');
        const nextButtonOnClickMock = jest.fn();
        nextButton.onclick = nextButtonOnClickMock;
        for (let i = 0; i < 2; i++) {
            userEvent.click(nextButton);
        }
        const prevButton = screen.getByTestId('prev-onboard-tour');
        const prevButtonOnClickMock = jest.fn();
        prevButton.onclick = prevButtonOnClickMock;
        userEvent.click(prevButton);
        await waitFor(() => {
            expect(nextButtonOnClickMock).toHaveBeenCalledTimes(2);
            expect(prevButtonOnClickMock).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onCloseTour when Finish is clicked', () => {
        render(<OnboardingTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-onboard-tour');
        const nextButtonOnClickMock = jest.fn();
        nextButton.onclick = nextButtonOnClickMock;
        for (let i = 0; i < 6; i++) {
            userEvent.click(nextButton);
        }
        const endTourButton = screen.getByTestId('finish-onboard-tour');
        userEvent.click(endTourButton);
        expect(mock_DBot_store?.dashboard.has_started_onboarding_tour).toBe(false);
    });
});

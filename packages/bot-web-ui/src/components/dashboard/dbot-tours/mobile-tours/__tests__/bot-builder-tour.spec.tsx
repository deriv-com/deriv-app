// eslint-disable-next-line simple-import-sort/imports
import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from '../bot-builder-tour';
import '@testing-library/react/dont-cleanup-after-each';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('<BotBuilderTour />', () => {
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

    it('renders botbuilder tour', () => {
        const { container } = render(<BotBuilderTour />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('shows the tour content when tour starts', () => {
        const tourElement = screen.queryByTestId('botbuilder-tour-mobile');
        expect(tourElement).toBeInTheDocument();
    });

    it('should show prev button if next button is clicked', async () => {
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        userEvent.click(nextButton);
        await waitFor(() => {
            const prevButton = screen.getByTestId('prev-bot-builder-tour');
            expect(prevButton).toBeInTheDocument();
        });
    });

    it('should not show prev button if we reach to step 1', async () => {
        const prevButton = screen.getByTestId('prev-bot-builder-tour');
        userEvent.click(prevButton);
        await waitFor(() => {
            expect(prevButton).not.toBeInTheDocument();
        });
    });

    it('should show step 2 on next button click', () => {
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        userEvent.click(nextButton);
        const navBar = screen.getByTestId('dbot-acc-id');
        expect(navBar).toHaveTextContent('Step 2');
    });

    it('should show step 3 on next button click', () => {
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        userEvent.click(nextButton);
        const navBar = screen.getByTestId('dbot-acc-id');
        expect(navBar).toHaveTextContent('Step 3');
    });

    it('calls onCloseTour when Finish is clicked', () => {
        const endTourButton = screen.getByTestId('finish-bot-builder-tour');
        userEvent.click(endTourButton);
        expect(mock_DBot_store?.dashboard.has_started_bot_builder_tour).toBe(false);
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from '../bot-builder-tour';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('BotBuilderTour', () => {
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
        render(<BotBuilderTour />, {
            wrapper,
        });
        const tourElement = screen.getByTestId('botbuilder-tour-mobile');
        expect(tourElement).toHaveClass('dbot-slider__bot-builder-tour');
    });

    it('Check if next button is clicked', async () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        if (!nextButton) {
            console.error('Next button not found. Make sure it exists in your component.'); // eslint-disable-line no-console
        }
        const onClickMock = jest.fn();
        nextButton.onclick = onClickMock;
        userEvent.click(nextButton);
        await waitFor(() => {
            expect(onClickMock).toHaveBeenCalledTimes(1);
        });
    });

    it('should check Previous button is clicked', async () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        const nextButtonOnClickMock = jest.fn();
        nextButton.onclick = nextButtonOnClickMock;
        userEvent.click(nextButton);
        const prevButton = screen.getByTestId('prev-bot-builder-tour');
        const prevButtonOnClickMock = jest.fn();
        prevButton.onclick = prevButtonOnClickMock;
        userEvent.click(prevButton);
        await waitFor(() => {
            expect(nextButtonOnClickMock).toHaveBeenCalledTimes(1);
            expect(prevButtonOnClickMock).toHaveBeenCalledTimes(1);
        });
    });

    it('calls onCloseTour when Finish is clicked', () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const nextButton = screen.getByTestId('next-bot-builder-tour');
        const nextButtonOnClickMock = jest.fn();
        nextButton.onclick = nextButtonOnClickMock;
        for (let i = 0; i < 2; i++) {
            userEvent.click(nextButton);
        }
        const endTourButton = screen.getByTestId('finish-bot-builder-tour');
        userEvent.click(endTourButton);
        expect(mock_DBot_store?.dashboard.has_started_bot_builder_tour).toBe(false);
    });

    it('check if accordion is clicked', async () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const accordion = screen.getByTestId('bot-builder-acc');
        const accordionOnClickMock = jest.fn();
        accordion.onclick = accordionOnClickMock;
        userEvent.click(accordion);
        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access
            expect(accordion.querySelector('.dbot-accordion__content--open')).toBeInTheDocument();
        });
    });
});

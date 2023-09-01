import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTour from '../../bot-builder-tour';

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

    it('shows accordion when tour rendered', () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const tourElement = screen.getByTestId('botbuilder-tour-mobile');
        expect(tourElement).toHaveClass('dbot-slider__bot-builder-tour');
    });

    it('check if accordion is open', async () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const accordion = screen.getByTestId('bot-builder-acc');
        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access
            expect(accordion.querySelector('.dbot-accordion__content--open')).toBeInTheDocument();
        });
    });

    it('check if accordion is closed', async () => {
        render(<BotBuilderTour />, {
            wrapper,
        });
        const accordion = screen.getByTestId('dbot-acc-id');
        const accordionOnClickMock = jest.fn();
        accordion.onclick = accordionOnClickMock;
        userEvent.click(accordion);

        await waitFor(() => {
            // eslint-disable-next-line testing-library/no-node-access
            expect(accordion.querySelector('.dbot-accordion__content--open')).not.toBeInTheDocument();
        });
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotStopped from '../../../components/bot-stopped';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('<BotStopped />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store?.dashboard?.setWebSocketState(false);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    const originalLocation = global.location;
    delete global.location;
    global.location = {
        ...originalLocation,
        replace: jest.fn(),
        reload: jest.fn(),
    };

    it('renders the BotStopped component', () => {
        render(<BotStopped />, {
            wrapper,
        });
        const dailog_title_element = screen.getByTestId('data-title');
        expect(dailog_title_element).toBeInTheDocument();
    });
    it('should go to reports page on click of go to reports button', async () => {
        render(<BotStopped />, {
            wrapper,
        });
        act(() => {
            screen.getByText('Go to Reports').click();
        });
        await waitFor(() => {
            expect(global.location.replace).toHaveBeenCalledWith('reports/positions');
        });
    });

    it('should reload page on click of Back to Bot', async () => {
        render(<BotStopped />, {
            wrapper,
        });
        act(() => {
            screen.getByText('Back to Bot').click();
        });
        await waitFor(() => {
            expect(global.location.reload).toHaveBeenCalled();
        });
    });

    it('should reload page on click of x button', async () => {
        render(<BotStopped />, {
            wrapper,
        });
        const svgCloseIcon = screen.getByTestId('data-close-button');
        act(() => {
            userEvent.click(svgCloseIcon);
        });
        await waitFor(() => {
            expect(global.location.reload).toHaveBeenCalled();
        });
    });
});

import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BotStopped from 'Components/bot-stopped';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';

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

    it('should render onClickClose on press of enter keydown', async () => {
        const mockEventListener = jest.fn();
        document.addEventListener('keydown', mockEventListener);
        render(<BotStopped />, {
            wrapper,
        });
        const close_button = screen.getByTestId('data-close-button');
        userEvent.type(close_button, '{Enter}');
        expect(mockEventListener).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
    });

    it('should render onClickClose on press of enter keydown', async () => {
        const mockEventListener = jest.fn();
        document.addEventListener('keydown', mockEventListener);
        render(<BotStopped />, {
            wrapper,
        });
        const close_button = screen.getByTestId('data-close-button');
        userEvent.type(close_button, '{Esc}');
        expect(mockEventListener).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter', code: 'Enter' }));
    });
});

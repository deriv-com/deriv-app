import React from 'react';
import { Formik } from 'formik';
import { BrowserRouter } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { TServerBotItem } from 'Stores/server-side-bot-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ServerSideBot from '../server-side-bot';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('< ServerSideBot />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_dbot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_dbot_store = mockDBotStore(mock_store, mock_ws);
        mock_dbot_store?.server_bot?.setSelectedStrategy('MARTINGALE');
        const mockOnSubmit = jest.fn();
        const initial_value = {
            tradetype: 'callput',
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <BrowserRouter>
                <StoreProvider store={mock_store}>
                    <DBotStoreProvider ws={mock_ws} mock={mock_dbot_store}>
                        <Formik initialValues={initial_value} onSubmit={mockOnSubmit}>
                            {children}
                        </Formik>
                    </DBotStoreProvider>
                </StoreProvider>
            </BrowserRouter>
        );
    });

    it('should render', () => {
        const { container } = render(<ServerSideBot />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText(/This is Beta version of server bot/)).toBeInTheDocument();
    });

    it('should close the performance on click back button for mobile', () => {
        const mock_bot: TServerBotItem = {
            bot_id: '001122',
            name: 'Bot 1',
            status: 'running',
            strategy: 'MARTINGALE',
        };
        mock_dbot_store?.server_bot?.setActiveBotId(mock_bot.bot_id);
        mock_dbot_store?.server_bot?.setBotList([mock_bot]);
        mock_store.ui.is_mobile = true;
        render(<ServerSideBot />, {
            wrapper,
        });
        const el_close = screen.getByTestId('dt_page_overlay_header_close');
        userEvent.click(el_close);
        expect(mock_dbot_store?.server_bot.active_bot_id).toBe('');
    });
});

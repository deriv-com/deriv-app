import React from 'react';
import moment from 'moment';
import { unmountComponentAtNode } from 'react-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen, waitFor } from '@testing-library/react';
import { transaction_elements } from 'Constants/transactions';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from '../../utils/mock';
import AppContent from '../app-content';

const mock_data = {
    data: {
        msg_type: 'proposal_open_contract',
        proposal_open_contract: { status: 'close', contract_id: 22 },
    },
};
const mock_unsubscribe = jest.fn();
jest.mock('react-toastify/dist/ReactToastify.css', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    api_base: {
        api: {
            onMessage: jest.fn(() => ({
                subscribe: jest.fn(callback => {
                    callback(mock_data);
                    return {
                        unsubscribe: mock_unsubscribe,
                    };
                }),
            })),
        },
    },
}));
jest.mock('Components/transaction-details', () => ({
    __esModule: true,
    default: () => <div>TransactionDetails</div>,
}));
jest.mock('Components/audio', () => ({
    __esModule: true,
    default: () => <div>Audio</div>,
}));
jest.mock('Components/bot-notification-messages', () => ({
    __esModule: true,
    default: () => <div>BotNotificationMessages</div>,
}));
jest.mock('../../pages/main', () => ({
    __esModule: true,
    default: () => <div>Dashboard</div>,
}));
jest.mock('Components/network-toast-popup', () => ({
    __esModule: true,
    default: () => <div>NetworkToastPopup</div>,
}));
jest.mock('../../pages/bot-builder', () => ({
    __esModule: true,
    default: () => <div>BotBuilder</div>,
}));
jest.mock('Components/bot-stopped', () => ({
    __esModule: true,
    default: () => <div>BotStopped</div>,
}));
jest.mock('Components/route-prompt-dialog', () => ({
    __esModule: true,
    default: () => <div>RoutePromptDialog</div>,
}));

jest.useFakeTimers();

window.Blockly = {
    Colours: { RootBlock: {} },
    utils: {
        genUid: jest.fn(() => 'test_uid'),
    },
};
describe('AppContent', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({
        common: {
            server_time: moment(),
        },
    });

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws as any);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws as any} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render loading initially', () => {
        mock_store.client.is_logged_in = true;
        render(<AppContent />, {
            wrapper,
        });
        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render Dashboard if user is not logged in', async () => {
        mock_store.client.is_logged_in = false;
        render(<AppContent />, {
            wrapper,
        });
        const dashboard = await screen.findByText('Dashboard');
        expect(dashboard).toBeInTheDocument();
    });

    it('should settle open contracts if there is any', async () => {
        mock_store.client.is_logged_in = true;
        mock_store.client.loginid = 'cr1';

        mock_DBot_store?.transactions?.recovered_transactions.push(11);
        if (mock_DBot_store)
            mock_DBot_store.transactions.elements = {
                cr1: [
                    {
                        type: transaction_elements.CONTRACT,
                        data: {
                            contract_id: 22,
                            is_completed: false,
                        },
                    },
                ],
            };

        render(<AppContent />, {
            wrapper,
        });
        await waitFor(() => {
            expect(mock_DBot_store?.transactions?.is_called_proposal_open_contract).toBeTruthy();
        });
    });

    it('should unsubscribe message handler on component unmount', async () => {
        mock_store.client.is_logged_in = true;
        mock_DBot_store?.transactions?.recovered_transactions.push(11);

        if (mock_DBot_store)
            mock_DBot_store.transactions.elements = {
                cr1: [
                    {
                        type: transaction_elements.CONTRACT,
                        data: {
                            contract_id: 22,
                            is_completed: false,
                        },
                    },
                ],
            };

        const { container } = render(<AppContent />, {
            wrapper,
        });
        jest.advanceTimersByTime(3000);

        unmountComponentAtNode(container);
        await waitFor(() => {
            expect(mock_unsubscribe).toBeCalled();
        });
    });

    it('should not render loading if user is offline', async () => {
        mock_store.client.is_logged_in = true;
        render(<AppContent />, {
            wrapper,
        });
        act(() => {
            const goOffline = new window.Event('offline');
            window.dispatchEvent(goOffline);
        });
        expect(screen.queryByTestId('dt_initial_loader')).not.toBeInTheDocument();
    });
});

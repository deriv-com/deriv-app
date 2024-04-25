import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { contract_stages } from 'Constants/contract-stage';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TradeAnimation from '../trade-animation';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
    stopBot: jest.fn(),
    getStrategySounds: jest.fn(() => []),
    shouldRunBot: jest.fn(() => true),
    runBot: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.useFakeTimers();

window.Blockly = {
    derivWorkspace: {
        getAllBlocks: jest.fn(() => ({
            find: jest.fn(),
        })),
    },
};

describe('TradeAnimation', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    let mock_store = mockStore({});
    mock_store = {
        ...mock_store,
        client: {
            ...mock_store.client,
            getSelfExclusion: jest.fn(),
            account_status: {
                ...mock_store.client.account_status,
                cashier_validation: ['WithdrawServiceUnavailableForPA'],
            },
        },
    };

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render <TradeAnimation />', () => {
        const { container } = render(<TradeAnimation />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should start the bot on click of `Run` button', async () => {
        mock_store.client.is_logged_in = true;
        render(<TradeAnimation />, { wrapper });
        const run_button = screen.getByRole('button', { name: /Run/i });
        userEvent.click(run_button);
        act(() => {
            jest.advanceTimersByTime(1300);
        });
        expect(screen.getByText(/Bot is starting/i)).toBeInTheDocument();
    });

    it('should update the run panel status correctly', () => {
        mock_DBot_store?.run_panel.setContractStage(contract_stages.PURCHASE_SENT);
        render(<TradeAnimation />, { wrapper });
        expect(screen.getByText(/Buying contract/i)).toBeInTheDocument();
    });

    it('should update the run panel status on contract close', () => {
        mock_DBot_store?.summary_card.onBotContractEvent({ profit: 0, is_completed: true, is_sold: true });
        mock_DBot_store?.run_panel.setContractStage(contract_stages.CONTRACT_CLOSED);
        render(<TradeAnimation />, { wrapper });
        expect(screen.getByText(/Contract closed/i)).toBeInTheDocument();
    });

    it('should stop the bot on click of `Stop` button', async () => {
        render(<TradeAnimation should_show_overlay />, { wrapper });
        const stop_button = screen.getByRole('button', { name: /Stop/i });
        userEvent.click(stop_button);
        expect(screen.getByText(/Bot is not running/i)).toBeInTheDocument();
    });
});

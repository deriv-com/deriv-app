import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { transaction_elements } from 'Constants/transactions';
import { mock_ws } from 'Utils/mock';
import { mock_contract } from 'Utils/mock/contract';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Download from '../download';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<Download />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Download component', () => {
        const { container } = render(<Download tab='' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the No transaction or activity yet message on transaction tab', () => {
        render(<Download tab='transactions' />, {
            wrapper,
        });

        const download_button = screen.getByText('Download');
        userEvent.click(download_button);
        expect(screen.getByText('No transaction or activity yet.'));
    });

    it('should render the Download is unavailable while your bot is running message', () => {
        render(<Download tab='transactions' />, {
            wrapper,
        });

        mock_DBot_store?.run_panel?.setIsRunning(true);
        const download_button = screen.getByText('Download');
        userEvent.click(download_button);
        expect(screen.getByText('Download is unavailable while your bot is running.'));
    });

    it('should render the Download is unavailable if there is transactions but bot is running', () => {
        mock_DBot_store?.run_panel?.setIsRunning(true);
        mock_DBot_store?.transactions?.transactions.push({
            data: {
                contract_id: 'test_contract_id_1',
                transaction_ids: {
                    buy: 'test_buy_id',
                    sell: 'test_sell_id',
                },
            },
        });

        render(<Download tab='transactions' />, {
            wrapper,
        });

        const download_button = screen.getByText('Download');
        userEvent.click(download_button);

        expect(screen.getByText('Download is unavailable while your bot is running.'));
    });

    it('should render the Download your journal message', () => {
        mock_store.client.is_logged_in = true;
        mock_store.client.loginid = 'cr1';

        if (mock_DBot_store)
            mock_DBot_store.transactions.elements = {
                cr1: [
                    {
                        type: transaction_elements.CONTRACT,
                        data: {
                            ...mock_contract,
                        },
                    },
                ],
            };

        render(<Download tab='journal' />, {
            wrapper,
        });

        const download_button = screen.getByText('Download');
        userEvent.click(download_button);
        expect(screen.getByText('Download your journal.'));
    });

    it('should render the No transaction or activity yet message on journal tab', () => {
        mock_DBot_store?.transactions?.transactions.pop();
        render(<Download tab='journal' />, {
            wrapper,
        });

        const download_button = screen.getByText('Download');
        userEvent.click(download_button);

        expect(screen.getByText('No transaction or activity yet.'));
    });
});

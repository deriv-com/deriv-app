import makeMockSocket from '../__mocks__/socket.mock';
import StatementStore from '../statement-store';
import { mock_statement_success, root_store_mock } from '../__mocks__/root.store.mock';
import { when } from 'mobx';
import { toMoment } from '@deriv/shared';
import { formatStatementTransaction } from '../Helpers/format-response';

const { wsClean, wsConnect, wsServer } = makeMockSocket();

describe('Statement Store', () => {
    let store: StatementStore;

    beforeEach(async () => {
        await wsConnect();
        store = new StatementStore({ root_store: root_store_mock });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => {
        wsClean();
    });

    it('Should have is_loading as falsy when user is online', () => {
        store.networkStatusChangeListener(true);
        expect(store.is_loading).toBeFalsy();
    });

    it('Should have is_loading as truthy when user is offline', () => {
        store.networkStatusChangeListener(false);
        expect(store.is_loading).toBeTruthy();
    });

    it('should do onMount ', async () => {
        store.onMount();

        const forget_all_response = {
            echo_req: {
                forget_all: ['proposal'],
                req_id: 2,
            },
            forget_all: [],
            msg_type: 'forget_all',
            req_id: 2,
        };
        await expect(wsServer).toReceiveMessage({ forget_all: ['proposal'], req_id: 2 });
        wsServer.send(forget_all_response);
        await expect(wsServer).toReceiveMessage({
            date_to: toMoment().startOf('day').add(1, 'd').subtract(1, 's').unix(),
            description: 1,
            limit: 100,
            req_id: 3,
            statement: 1,
        });
        wsServer.send(mock_statement_success);

        const expected_transactions = mock_statement_success.statement.transactions.map(transaction =>
            formatStatementTransaction(
                transaction,
                root_store_mock.client.currency,
                root_store_mock.active_symbols.active_symbols
            )
        );

        when(
            () => store.data.length,
            () => {
                expect(store.data.length).toBe(2);
                expect(store.data).toStrictEqual(expected_transactions);
            }
        );

        await expect(wsServer).toReceiveMessage({ account_statistics: 1, req_id: 4 });

        const statistic_response = {
            account_statistics: {
                total_deposits: 100,
                total_withdrawals: 50,
            },
            echo_req: { account_statistics: 1, req_id: 4 },
            msg_type: 'account_statistics',
            req_id: 4,
        };

        wsServer.send(statistic_response);
        when(
            () => store.account_statistics?.total_deposits > 0,
            () => {
                expect(store.account_statistics).toStrictEqual({
                    total_deposits: 100,
                    total_withdrawals: 50,
                });
            }
        );
    });

    it('should do something', async () => {
        store.loadAccountStatistics();

        // await expect(wsServer).toReceiveMessage({ account_statistics: 1, req_id: 2 });

        const response = {
            account_statistics: {
                total_deposits: 100,
                total_withdrawals: 50,
            },
            echo_req: { account_statistics: 1, req_id: 2 },
            msg_type: 'account_statistics',
            req_id: 2,
        };

        wsServer.send(response);

        when(
            () => store.account_statistics?.total_deposits > 0,
            () => {
                expect(store.account_statistics).toStrictEqual({
                    total_deposits: 100,
                    total_withdrawals: 50,
                });
            }
        );
    });

    it('Should do onUnmount', async () => {
        store.onUnmount();
        const forget_all_response = {
            echo_req: {
                forget_all: ['proposal'],
                req_id: 1,
            },
            forget_all: [],
            msg_type: 'forget_all',
            req_id: 1,
        };
        await expect(wsServer).toReceiveMessage({ forget_all: ['proposal'], req_id: 1 });
        wsServer.send(forget_all_response);
    });
});

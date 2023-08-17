import { reaction } from 'mobx';

const GTM = (() => {
    let root_store;

    const getLoginId = () => {
        return root_store.core.client.loginid;
    };

    const getServerTime = () => {
        return root_store?.core?.server_time?.unix() || Date.now();
    };

    const pushDataLayer = data => {
        return root_store?.core?.gtm?.pushDataLayer(data);
    };

    const init = _root_store => {
        try {
            root_store = _root_store;

            const { run_panel, transactions } = root_store;
            const run_statistics = run_panel.statistics;

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running && onRunBot(run_statistics)
            );

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(transactions.contracts)
            );
        } catch (error) {
            console.warn('Error initializing GTM reactions ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = statistics => {
        try {
            const run_id = `${getLoginId()}-${getServerTime()}`;
            const counters = `tr:${statistics.number_of_runs},\
                ts:${statistics.total_stake},\
                py:${statistics.total_payout},\
                lc:${statistics.lost_contracts},\
                wc:${statistics.won_contracts},\
                pr:${statistics.total_profit}`;

            const data = {
                counters: counters.replace(/\s/g, ''),
                event: 'dbot_run',
                run_id,
            };
            pushDataLayer(data);
        } catch (error) {
            console.warn('Error pushing run data to datalayer', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = contracts => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract && contract.is_completed) {
                const data = {
                    event: 'dbot_run_transaction',
                    reference_id: contract.refrence_id,
                };
                pushDataLayer(data);
            }
        } catch (error) {
            console.warn('Error pushing transaction to datalayer', error); // eslint-disable-line no-console
        }
    };

    return {
        init,
        pushDataLayer,
    };
})();

export default GTM;

import { reaction } from 'mobx';

const GTM = (() => {
    
    let root_store;

    const getLoginId = () => {
        return root_store.core.client.loginid;
    };

    const getServerTime = () => {
        return root_store.core.common.server_time.unix();
    };

    const pushDataLayer = (data) => {
        return root_store.core.gtm.pushDataLayer(data);
    };

    const init = (_root_store) => {
        try {
            root_store = _root_store;

            const { run_panel, transactions, summary: s } = root_store;

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running && onRunBot(s.summary)
            );

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(transactions.contracts)
            );

        } catch (error) {
            console.warn('Error initializing GTM reactions ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = (summary) => {
        try {
            const run_id = getLoginId().concat(getLoginId(), getServerTime());
            const summary_str = Object.values(summary).forEach(value => {
                return value.concat(value);
            });
            const data = {
                event  : 'dbot_run',
                run_id,
                summary: summary_str,
            };
            pushDataLayer(data);
            console.warn('pushing run data to datalayer', data); // eslint-disable-line no-console
        } catch (error) {
            console.warn('Error pushing run data to datalayer', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (contracts) => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract && contract.is_completed) {
                const data = {
                    event: 'dbot_run',
                    refrence_id: contract.refrence_id,
                };
                pushDataLayer(data);
                console.warn('pushing transaction data to datalayer', data); // eslint-disable-line no-console
            }
        } catch (error) {
            console.warn('Error pushing transaction to datalayer', error); // eslint-disable-line no-console
        }
    };

    return {
        init,
    };
})();

export default GTM;

import firebase             from 'firebase';
import                      'firebase/firestore';
import { reaction }         from 'mobx';
import { contract_stages }  from '../constants/contract-stage';
import { message_types }    from '../constants/messages';

const firestore = (() => {

    let db, users, doc_id;

    const init = (root_store) => {
        try {
            // Initialize Cloud Firestore through Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey   : 'AIzaSyA52MX2l8p75-w7nvab7fU6Lk6KwLqnyEI',
                    projectId: 'derivbot-248506',
                });
            }

            const { core: { client, common }, run_panel, transactions, journal, summary: s } = root_store;

            db = firebase.firestore();
            users = db.collection('Users');

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running ?
                    onRunBot(client.loginid, s.summary, common.server_time.unix()) :
                    onStopBot(client.loginid, common.server_time.unix())
            );

            reaction(
                () => s.summary.number_of_runs,
                () => {
                    // send the summary when contract closes and bot is stopped
                    if (!run_panel.is_running &&
                        run_panel.contract_stage.index === contract_stages.CONTRACT_CLOSED.index) {
                        onSummaryChanged(client.loginid, s.summary, common.server_time.unix());
                    }
                }
            );

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(client.loginid, transactions.contracts, common.server_time.unix())
            );

            reaction(
                () => journal.messages,
                () => onErrorHappened(client.loginid, journal.messages, common.server_time.unix())
            );
        } catch (error) {
            console.warn('Error initializing firestore ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = (login_id, summary, server_time) => {
        try {
            const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
            users.doc(login_id).collection('Runs').add({
                start_time: server_time,
                account_id: login_id,
                xml       : strategy,
            })
                .then((docRef) => {
                    doc_id = docRef.id;
                    onSummaryChanged(login_id, summary, server_time);
                })
                .catch((error) => {
                    console.warn('Error adding document to firestore ', error); // eslint-disable-line no-console
                    doc_id = Math.floor(1000 + Math.random() * 9000);
                });
        } catch (error) {
            console.warn('Error adding document to firestore when bot runs ', error); // eslint-disable-line no-console
        }
    };

    const onStopBot = (login_id, server_time) => {
        try {
            users.doc(login_id).collection('Runs').doc(doc_id).set({
                end_time: server_time,
            }, { merge: true });
        } catch (error) {
            console.warn('Error adding document to firestore when bot stops ', error); // eslint-disable-line no-console
        }
    };

    const onSummaryChanged = (login_id, summary, server_time) => {
        try {
            if (summary) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Summaries').add({
                    lost_contracts: summary.lost_contracts,
                    number_of_runs: summary.number_of_runs,
                    total_profit  : summary.total_profit,
                    total_payout  : summary.total_payout,
                    total_stake   : summary.total_stake,
                    won_contracts : summary.won_contracts,
                    time_stamp    : server_time,
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when summary changes ', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (login_id, contracts, server_time) => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract && contract.is_completed) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Transactions').add({
                    buy_price    : contract.buy_price,
                    contract_type: contract.contract_type,
                    currency     : contract.currency,
                    refrence_id  : contract.refrence_id,
                    entry_spot   : contract.entry_spot,
                    exit_spot    : contract.exit_spot,
                    profit       : contract.profit,
                    time_stamp   : server_time,
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when transaction closes', error); // eslint-disable-line no-console
        }
    };

    const onErrorHappened = (login_id, messages, server_time) => {
        try {
            const message = messages.length > 0 && messages[0];
            if (message && message.message_type === message_types.ERROR) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Errors').add({
                    date      : message.date,
                    time      : message.time,
                    message   : message.message,
                    time_stamp: server_time,
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when error happens in bot ', error); // eslint-disable-line no-console
        }
    };

    return {
        init,
    };
})();

export default firestore;

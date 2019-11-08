import firebase from 'firebase';
import 'firebase/firestore';
import { reaction } from 'mobx';
import { message_types } from '../constants/messages';

const firestore = (() => {

    let db, users, runs, doc_id, server_time;

    const init = (root_store) => {
        try {
            // Initialize Cloud Firestore through Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey   : 'AIzaSyA7A_acKTF7Vf2l_n8gxx2SUVT-rBxhPVQ',
                    // authDomain: 'localhost.binary.sx',
                    projectId: 'derivbot-248506',
                });
            }

            const { core: { client }, run_panel, transactions, journal, summary: s } = root_store;
            server_time = root_store.core.common.server_time;

            db = firebase.firestore();
            users = db.collection('Users');
            runs = users.doc(client.loginid).collection('Runs');

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running ?
                    onRunBot(client.loginid) :
                    onStopBot()
            );

            reaction(
                () => s.summary.number_of_runs,
                () => onSummaryChanged(s.summary)
            );

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(transactions.contracts)
            );

            reaction(
                () => journal.messages,
                () => onErrorHappened(journal.messages)
            );
        } catch (error) {
            console.warn('Error initializing firestore ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = (login_id) => {
        try {
            const start_time = server_time.unix();
            const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
            runs.add({
                start_time,
                account_id: login_id,
                xml       : strategy,
            })
                .then((docRef) => {
                    doc_id = docRef.id;
                })
                .catch((error) => {
                    console.warn('Error adding document to firestore ', error); // eslint-disable-line no-console
                    doc_id = Math.floor(1000 + Math.random() * 9000);
                });
        } catch (error) {
            console.warn('Error adding document to firestore when bot runs ', error); // eslint-disable-line no-console
        }
    };

    const onStopBot = () => {
        try {
            runs.doc(doc_id).update({
                end_time: server_time.unix(),
            });
        } catch (error) {
            console.warn('Error adding document to firestore when bot stops ', error); // eslint-disable-line no-console
        }
    };

    const onSummaryChanged = (summary) => {
        try {
            if (summary) {
                runs.doc(doc_id).collection('Summaries').add({
                    lost_contracts: summary.lost_contracts,
                    number_of_runs: summary.number_of_runs,
                    total_profit  : summary.total_profit,
                    total_payout  : summary.total_payout,
                    total_stake   : summary.total_stake,
                    won_contracts : summary.won_contracts,
                    time_stamp    : server_time.unix(),
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when summary changes ', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (contracts) => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract && contract.is_completed) {
                runs.doc(doc_id).collection('Transactions').add({
                    buy_price    : contract.buy_price,
                    contract_type: contract.contract_type,
                    currency     : contract.currency,
                    refrence_id  : contract.refrence_id,
                    entry_spot   : contract.entry_spot,
                    exit_spot    : contract.exit_spot,
                    profit       : contract.profit,
                    time_stamp   : server_time.unix(),
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when transaction closes', error); // eslint-disable-line no-console
        }
    };

    const onErrorHappened = (messages) => {
        try {
            const message = messages.length > 0 && messages[0];
            if (message && message.message_type === message_types.ERROR) {
                runs.doc(doc_id).collection('Errors').add({
                    date      : message.date,
                    time      : message.time,
                    message   : message.message,
                    time_stamp: server_time.unix(),
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

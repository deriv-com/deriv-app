import  firebase          from 'firebase';
import  'firebase/firestore';
import { reaction }       from 'mobx';
import { message_types }  from '../constants/messages';

const firestore = (() => {

    var db, users, runs, doc_id, server_time;

    const init = (root_store) => {
        try {
            // Initialize Cloud Firestore through Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey: 'AIzaSyBNPbVQw1mmUSQHclaR4jKmBpTuDGQuFH4',
                    authDomain: 'localhost.binary.sx',
                    projectId: 'deriv-app'
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
            )

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(transactions.contracts)
            )

            reaction(
                () => journal.messages,
                () => onErrorHappend(journal.messages)
            )
        }
        catch (error) {
            console.error("Error initializing firestore ", error);
        }
    }

    const onRunBot = (login_id) => {
        try {
            const start_time = server_time.unix();
            const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
            runs.add({
                start_time,
                account_id: login_id,
                xml: strategy,
            })
                .then(function (docRef) {
                    doc_id = docRef.id;
                })
                .catch(function (error) {
                    console.error("Error adding document to firestore ", error);
                    doc_id = Math.floor(1000 + Math.random() * 9000)
                });
        }
        catch (error) {
            console.error("Error adding document to firestore when bot runs ", error);
        }
    }

    const onStopBot = () => {
        try {
            runs.doc(doc_id).update({
                end_time: server_time.unix(),
            });
        }
        catch (error) {
            console.error("Error adding document to firestore when bot stops ", error);
        }
    }

    const onSummaryChanged = (summary) => {
        try {
            if (summary) {
                runs.doc(doc_id).collection('Summaries').add({
                    lost_contracts: summary.lost_contracts,
                    number_of_runs: summary.number_of_runs,
                    total_profit: summary.total_profit,
                    total_payout: summary.total_payout,
                    total_stake: summary.total_stake,
                    won_contracts: summary.won_contracts,
                    time_stamp: server_time.unix()
                });
            }
        }
        catch (error) {
            console.error("Error adding document to firestore when summary changes ", error);
        }
    }


    const onTransactionClosed = (contracts) => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract.is_completed) {
                runs.doc(doc_id).collection('Transactions').add({
                    buy_price: contract.buy_price,
                    contract_type: contract.contract_type,
                    currency: contract.currency,
                    refrence_id: contract.refrence_id,
                    entry_spot: contract.entry_spot,
                    exit_spot: contract.exit_spot,
                    profit: contract.profit,
                    time_stamp: server_time.unix()
                });
            }
        }
        catch (error) {
            console.error("Error adding document to firestore when transaction closes", error);
        }
    }


    const onErrorHappend = (messages) => {
        try {
            const item = messages.length > 0 && messages[0];
            if (item.message_type === message_types.ERROR) {
                runs.doc(doc_id).collection('Errors').add({
                    date: item.date,
                    time: item.time,
                    message: item.message,
                    time_stamp: server_time.unix()
                });
            }
        }
        catch (error) {
            console.error("Error adding document to firestore when error happens in bot ", error);
        }
    }

    return {
        init,
    }
})();

export default firestore;
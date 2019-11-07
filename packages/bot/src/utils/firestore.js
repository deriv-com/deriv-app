import { reaction } from 'mobx';
const firebase = require("firebase");
require("firebase/firestore");

const firestore = (() => {

    var db, users, runs, doc_id;

    const init = (root_store) => {
        // Initialize Cloud Firestore through Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: 'AIzaSyBNPbVQw1mmUSQHclaR4jKmBpTuDGQuFH4',
                authDomain: 'localhost.binary.sx',
                projectId: 'deriv-app'
            });
        }

        const run_panel = root_store.run_panel;
        const client = root_store.core.client;
        const transactions = root_store.transactions;

        db = firebase.firestore();
        users = db.collection('Users');
        runs = users.doc(client.loginid).collection('Runs');

        reaction(
            () => run_panel.is_running,
            () => run_panel.is_running ?
                onRunBotEvent(client.loginid) :
                onStopBotEvent()
        );

        reaction(
            () => transactions.contracts,
            () => onTransactionEvent(transactions.contracts)
        )
    }

    const onRunBotEvent = (login_id) => {
        const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
        runs.add({
            start_time: Date.now(),
            account_id: login_id,
            xml: strategy
        }).then(function(docRef) {
            doc_id= docRef.id;
        })
        .catch(function(error) {
            console.error("Error adding document to firestore", error);
            doc_id = Math.floor(10000000 + Math.random() * 90000000)
        });
    }

    const onStopBotEvent = () => {
        const end_time = Date.now();
        runs.doc(doc_id).update({
            end_time: end_time,
        });
    }

    const onTransactionEvent = (contracts) => {
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
                is_completed:contract.is_completed
            });
        }
    }

    return {
        init,
    }
})();

export default firestore;
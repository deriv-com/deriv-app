import { reaction } from 'mobx';
import { message_types } from '../constants/messages';
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
        const journal = root_store.journal;

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
            () => transactions.contracts,
            () => onTransaction(transactions.contracts)
        )

        reaction(
            () => journal.messages,
            () => onError(journal.messages)
        )
    }

    const onRunBot = (login_id) => {
        const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
        runs.add({
            start_time: firebase.firestore.FieldValue.serverTimestamp(),
            account_id: login_id,
            xml: strategy,
        }).then(function (docRef) {
            doc_id = docRef.id;
        })
            .catch(function (error) {
                console.error("Error adding document to firestore", error);
                doc_id = Math.floor(10000000 + Math.random() * 90000000)
            });
    }

    const onStopBot = () => {
        runs.doc(doc_id).update({
            end_time: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    const onTransaction = (contracts) => {
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
                is_completed: contract.is_completed,
                time_stamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }


    const onError = (messages) => {
        const item = messages.length > 0 && messages[0];
        if (item.message_type === message_types.ERROR) {
            runs.doc(doc_id).collection('Errors').add({
                date: item.date,
                time: item.time,
                message: item.message,
                time_stamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    return {
        init,
    }
})();

export default firestore;
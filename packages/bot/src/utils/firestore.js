import firebase            from 'firebase/app';
import                     'firebase/auth';
import                     'firebase/firestore';
import { reaction }        from 'mobx';
import { contract_stages } from '../constants/contract-stage';
import { message_types }   from '../constants/messages';

const firestore = (() => {

    let db, users, doc_id, root_store;

    const getServerTime = ()=> {
        return root_store.core.common.server_time.unix();
    };

    const init = (_root_store) => {
        try {
            root_store = _root_store;
            // Initialize Cloud Firestore through Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp({
                    apiKey   : 'AIzaSyA52MX2l8p75-w7nvab7fU6Lk6KwLqnyEI',
                    projectId: 'derivbot-248506',
                });

                const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTU3NTk0NzkxNSwiZXhwIjoxNTc1OTUxNTE1LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ndms2ZUBkZXJpdmJvdC0yNDg1MDYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1ndms2ZUBkZXJpdmJvdC0yNDg1MDYuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJhbmFseXRpY3MifQ.FEHZHILg2mQzdKXr7NpFroahusvrIh1rI7a7f0i-rbALj32UAt66jL_oIrB_n26JDooip6kc6nW2MjJ8dOVDKi1rgaDtBXsXk5scAd61x6v7xH7c9gzD1Dt7HfdB4JmiZEF1k4EWljL081VPc8wwqCxAex5kciig71SG0_uzlQ1vc4tb8IHLS8ZG-hQ4WdrkpBx1TtMkW0uRd1NiKKKsF-jOTggn8iDJpheR3g5A_ULXhO6grKppgOdd9PASx4pn-y8t4JEdRUFHEkWNumsM2vFO_C_bEUNXxO8xi-i0cxkDLNBlpO7fpL2SIVmGrCD1VSM8RPg9R8iJwvX40drbNw';
                firebase.auth().signInWithCustomToken(token).catch(function(error) {
                    console.log('error happened while authenticating firestore' , error); // eslint-disable-line no-console
                });
            }

            const { core: { client }, run_panel, transactions, journal, summary: s } = root_store;

            db = firebase.firestore();
            users = db.collection('Users');

            reaction(
                () => run_panel.is_running,
                () => run_panel.is_running ?
                    onRunBot(client.loginid, s.summary) :
                    onStopBot(client.loginid)
            );

            reaction(
                () => s.summary.number_of_runs,
                () => {
                    // send the summary when contract closes and bot is stopped
                    if (!run_panel.is_running &&
                        run_panel.contract_stage.index === contract_stages.CONTRACT_CLOSED.index) {
                        onSummaryChanged(client.loginid, s.summary);
                    }
                }
            );

            reaction(
                () => transactions.contracts,
                () => onTransactionClosed(client.loginid, transactions.contracts)
            );

            reaction(
                () => journal.messages,
                () => onErrorHappened(client.loginid, journal.messages)
            );
        } catch (error) {
            console.warn('Error initializing firestore ', error); // eslint-disable-line no-console
        }
    };

    const onRunBot = (login_id, summary) => {
        try {
            const strategy = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.derivWorkspace));
            users.doc(login_id).collection('Runs').add({
                start_time: getServerTime(),
                account_id: login_id,
                xml       : strategy,
            })
                .then((docRef) => {
                    doc_id = docRef.id;
                    onSummaryChanged(login_id, summary);
                })
                .catch((error) => {
                    console.warn('Error adding document to firestore ', error); // eslint-disable-line no-console
                    doc_id = Math.floor(1000 + Math.random() * 9000);
                });
        } catch (error) {
            console.warn('Error adding document to firestore when bot runs ', error); // eslint-disable-line no-console
        }
    };

    const onStopBot = (login_id) => {
        try {
            users.doc(login_id).collection('Runs').doc(doc_id).set({
                end_time: getServerTime(),
            }, { merge: true });
        } catch (error) {
            console.warn('Error adding document to firestore when bot stops ', error); // eslint-disable-line no-console
        }
    };

    const onSummaryChanged = (login_id, summary) => {
        try {
            if (summary) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Summaries').add({
                    lost_contracts: summary.lost_contracts,
                    number_of_runs: summary.number_of_runs,
                    total_profit  : summary.total_profit,
                    total_payout  : summary.total_payout,
                    total_stake   : summary.total_stake,
                    won_contracts : summary.won_contracts,
                    time_stamp    : getServerTime(),
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when summary changes ', error); // eslint-disable-line no-console
        }
    };

    const onTransactionClosed = (login_id, contracts) => {
        try {
            const contract = contracts.length > 0 && contracts[0];
            if (contract && contract.is_completed) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Transactions').add({
                    buy_price    : contract.buy_price,
                    contract_type: contract.contract_type,
                    currency     : contract.currency,
                    reference_id : contract.reference_id,
                    entry_spot   : contract.entry_spot,
                    exit_spot    : contract.exit_spot,
                    profit       : contract.profit,
                    time_stamp   : getServerTime(),
                });
            }
        } catch (error) {
            console.warn('Error adding document to firestore when transaction closes', error); // eslint-disable-line no-console
        }
    };

    const onErrorHappened = (login_id, messages) => {
        try {
            const message = messages.length > 0 && messages[0];
            if (message && message.message_type === message_types.ERROR) {
                users.doc(login_id).collection('Runs').doc(doc_id).collection('Errors').add({
                    date      : message.date,
                    time      : message.time,
                    message   : message.message,
                    time_stamp: getServerTime(),
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

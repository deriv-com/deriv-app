import { action, reaction } from 'mobx';
import crc32 from 'crc-32/crc32';
import { isProduction, cloneObject } from '@deriv/shared';
import { DBot } from '@deriv/bot-skeleton';
import { transaction_elements } from '../constants/transactions';

export default class DataCollectionStore {
    constructor(root_store) {
        if (!isProduction()) {
            return;
        }

        this.root_store = root_store;
        this.endpoint = 'https://dbot-conf-dot-business-intelligence-240201.df.r.appspot.com/dbotconf';
        this.transaction_ids = {};
        this.strategy_hash = '';
        this.strategy_hashes = {};

        // Constants
        this.IS_PENDING = false;
        this.IS_PROCESSED = true;

        reaction(
            () => this.root_store.run_panel.is_running,
            () => (this.root_store.run_panel.is_running ? this.trackRun() : undefined)
        );
        reaction(
            () => this.root_store.transactions.elements,
            elements => this.trackTransaction(elements)
        );
    }

    @action.bound
    async trackRun() {
        const xml_dom = this.cleanXmlFile(Blockly.Xml.workspaceToDom(DBot.workspace, /* opt_noId */ true));
        const xml_string = Blockly.Xml.domToText(xml_dom);

        this.setStrategyHash(this.getHash(xml_string));
        this.setRunId(this.generateRunId(xml_string));

        if (!Object.keys(this.strategy_hashes).includes(this.strategy_hash)) {
            this.strategy_hashes[this.strategy_hash] = this.IS_PENDING;

            const pako = await import(/* webpackChunkName: "dbot-collection" */ 'pako');
            const body = pako.deflate(xml_string, { to: 'string' });

            fetch(`${this.endpoint}/${this.run_id}/null/${this.strategy_hash}`, {
                body,
                headers: {
                    'Content-Encoding': 'gzip',
                    'Content-Type': 'application/xml',
                    'Content-Length': body.length,
                },
                method: 'POST',
                mode: 'cors',
            })
                .then(() => {
                    this.strategy_hashes[this.strategy_hash] = this.IS_PROCESSED;
                })
                .catch(() => {
                    delete this.strategy_hashes[this.strategy_hash];
                });
        }
    }

    @action.bound
    async trackTransaction(elements) {
        const contracts = elements.filter(element => element.type === transaction_elements.CONTRACT);
        const contract = contracts[0]; // Most recent contract.

        if (contract) {
            const { buy: transaction_id } = contract.data.transaction_ids;

            if (!Object.keys(this.transaction_ids).includes(transaction_id.toString())) {
                this.transaction_ids[transaction_id] = this.IS_PENDING;

                fetch(`${this.endpoint}/${this.run_id}/${transaction_id}/${this.strategy_hash}`, {
                    body: '',
                    headers: {
                        'Content-Type': 'application/xml',
                        'Content-Length': 0,
                    },
                    method: 'POST',
                    mode: 'cors',
                })
                    .then(() => {
                        this.transaction_ids[transaction_id] = this.IS_PROCESSED;
                    })
                    .catch(() => {
                        delete this.transaction_ids[transaction_id];
                    });
            }
        }
    }

    @action.bound
    setRunId(run_id) {
        this.run_id = run_id;
    }

    @action.bound
    setStrategyHash(strategy_hash) {
        this.strategy_hash = strategy_hash;
    }

    cleanXmlFile = xml_dom => {
        const useless_attributes = ['x', 'y'];
        const updated_dom = cloneObject(xml_dom);
        const removeAttributesRecursively = element => {
            useless_attributes.forEach(useless_attribute => element.removeAttribute(useless_attribute));
            Array.from(element.children).forEach(child => removeAttributesRecursively(child));
        };

        removeAttributesRecursively(updated_dom);
        return updated_dom;
    };

    getHash = string => btoa(crc32.str(string));

    generateRunId = xml_string => {
        return this.getHash(xml_string + this.root_store.core.client.loginid + Math.random());
    };
}

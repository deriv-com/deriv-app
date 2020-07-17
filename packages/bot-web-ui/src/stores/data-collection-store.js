import { action, reaction, computed, observable } from 'mobx';
import crc32 from 'crc-32/crc32';
import { isProduction, cloneObject } from '@deriv/shared';
import { DBot } from '@deriv/bot-skeleton';
import { transaction_elements } from '../constants/transactions';

export default class DataCollectionStore {
    constructor(root_store) {
        if (!isProduction()) {
            this.root_store = root_store;

            reaction(
                () => this.root_store.run_panel.is_running,
                () => (this.root_store.run_panel.is_running ? this.trackRun() : undefined)
            );
            reaction(
                () => this.root_store.transactions.elements,
                elements => this.trackTransaction(elements)
            );
        }
    }

    // Constants
    IS_PENDING = false;
    IS_PROCESSED = true;

    endpoint = 'https://dbot-conf-dot-business-intelligence-240201.df.r.appspot.com/dbotconf';
    transaction_ids = {};
    should_post_xml = true;

    @observable strategy_content = '';

    @computed
    get strategy_hash() {
        return this.getHash(this.strategy_content);
    }

    @action.bound
    async trackRun() {
        const xml_dom = this.cleanXmlDom(Blockly.Xml.workspaceToDom(DBot.workspace, /* opt_noId */ true));
        const xml_string = Blockly.Xml.domToText(xml_dom);
        const xml_hash = this.getHash(xml_string);

        if (this.strategy_hash !== xml_hash) {
            this.should_post_xml = true;
            this.setStrategyContent(xml_string);
        }

        // Keep track of run_id for analysis.
        // A different run_id doesn't necessarily mean a different strategy.
        this.setRunId(this.getHash(xml_hash + this.root_store.core.client.loginid + Math.random()));
    }

    @action.bound
    async trackTransaction(elements) {
        const pako = await import(/* webpackChunkName: "dbot-collection" */ 'pako');
        const contracts = elements.filter(element => element.type === transaction_elements.CONTRACT);
        const contract = contracts[0]; // Most recent contract.

        if (!contract) {
            return;
        }

        const { buy: transaction_id } = contract.data.transaction_ids;
        const is_known_transaction = Object.keys(this.transaction_ids).includes(transaction_id.toString());

        if (!is_known_transaction) {
            this.transaction_ids[transaction_id] = this.IS_PENDING;

            const getPayload = () => {
                const body = pako.deflate(this.strategy_content, { to: 'string' });
                return {
                    body,
                    headers: {
                        'Content-Encoding': 'gzip',
                        'Content-Type': 'application/xml',
                        'Content-Length': body.length,
                    },
                };
            };

            fetch(`${this.endpoint}/${this.run_id}/${transaction_id}/${this.strategy_hash}`, {
                ...(this.should_post_xml ? getPayload() : {}),
                method: 'POST',
                mode: 'cors',
            })
                .then(() => {
                    this.should_post_xml = false;
                    this.transaction_ids[transaction_id] = this.IS_PROCESSED;
                })
                .catch(() => {
                    delete this.transaction_ids[transaction_id];
                });
        }
    }

    @action.bound
    setRunId(run_id) {
        this.run_id = run_id;
    }

    @action.bound
    setStrategyContent(strategy_content) {
        this.strategy_content = strategy_content;
    }

    cleanXmlDom = xml_dom => {
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
}

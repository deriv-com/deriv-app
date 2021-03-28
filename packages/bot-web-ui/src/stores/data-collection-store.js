import { reaction } from 'mobx';
import crc32 from 'crc-32/crc32';
import { isProduction, cloneObject } from '@deriv/shared';
import { DBot } from '@deriv/bot-skeleton';

export default class DataCollectionStore {
    constructor(root_store) {
        if (isProduction() || /(.*?)\.binary.sx$/.test(window.location.hostname)) {
            this.root_store = root_store;

            reaction(
                () => this.root_store.run_panel.is_running,
                () => (this.root_store.run_panel.is_running ? this.trackRun() : undefined)
            );
            reaction(
                () => this.root_store.transactions.transactions,
                transactions => this.trackTransaction(transactions)
            );
        }
    }

    // Constants
    IS_PENDING = false;
    IS_PROCESSED = true;

    endpoint = 'https://dbot-conf-dot-business-intelligence-240201.df.r.appspot.com/dbotconf';
    run_id = '';
    run_start = 0;
    should_post_xml = true;
    strategy_content = '';
    transaction_ids = {};

    getXmlString() {
        const xml_dom = this.cleanXmlDom(Blockly.Xml.workspaceToDom(DBot.workspace, /* opt_noId */ true));
        return Blockly.Xml.domToText(xml_dom);
    }

    getXmlHash() {
        return this.getHash(this.getXmlString());
    }

    async trackRun() {
        if (this.getHash(this.strategy_content) !== this.getXmlHash()) {
            this.should_post_xml = true;
            this.setStrategyContent(this.getXmlString());
        }

        this.setRunStart(this.root_store.common.server_time.unix());
    }

    async trackTransaction(contracts) {
        const pako = await import(/* webpackChunkName: "dbot-collection" */ 'pako');
        const contract = contracts[0]; // Most recent contract.

        if (!contract) {
            return;
        }

        const { buy: transaction_id } = contract.data.transaction_ids;
        const is_known_transaction = Object.keys(this.transaction_ids).includes(transaction_id.toString());

        if (!is_known_transaction) {
            this.transaction_ids[transaction_id] = this.IS_PENDING;

            const getPayload = () => {
                const content = pako.gzip(this.strategy_content);
                return {
                    body: content,
                    headers: {
                        'Content-Encoding': 'gzip',
                        'Content-Type': 'application/xml',
                        Referer: window.location.hostname,
                    },
                };
            };
            this.setRunId(this.getHash(this.getXmlHash() + this.root_store.core.client.loginid + Math.random()));
            fetch(
                `${this.endpoint}/${this.run_id}/${transaction_id}/${this.run_start}/${this.getHash(
                    this.strategy_content
                )}`,
                {
                    ...(this.should_post_xml ? getPayload() : {}),
                    method: 'POST',
                    mode: 'cors',
                }
            )
                .then(() => {
                    this.should_post_xml = false;
                    this.transaction_ids[transaction_id] = this.IS_PROCESSED;
                })
                .catch(() => {
                    delete this.transaction_ids[transaction_id];
                });
        }
    }

    setRunId(run_id) {
        this.run_id = run_id;
    }

    setRunStart(timestamp) {
        this.run_start = timestamp;
    }

    setStrategyContent(strategy_content) {
        this.strategy_content = strategy_content;
    }

    cleanXmlDom = xml_dom => {
        const useless_attributes = ['x', 'y', 'id'];
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

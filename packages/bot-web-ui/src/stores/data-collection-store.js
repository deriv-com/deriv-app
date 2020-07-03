import { action, reaction } from 'mobx';
import crc32 from 'crc-32/crc32';
import { DBot } from '@deriv/bot-skeleton';
import { transaction_elements } from '../constants/transactions';

export default class DataCollectionStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.endpoint = 'https://dbot-conf-dot-business-intelligence-240201.df.r.appspot.com/dbotconf';
        this.known_hashes = [];
        this.pako = null;
        this.transaction_ids = [];

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
        const pako = await import(/* webpackChunkName: "dbot-collection" */ 'pako');
        const xml_string = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(DBot.workspace));
        const strategy_hash = crc32.str(xml_string);

        this.setRunId(this.generateRunId(xml_string));

        if (!this.known_hashes.includes(strategy_hash)) {
            this.known_hashes.push(strategy_hash);

            const body = pako.deflate(xml_string, { to: 'string' });

            fetch(`${this.endpoint}/${this.getRunId()}`, {
                body,
                headers: {
                    'Content-Encoding': 'gzip',
                    'Content-Type': 'application/xml',
                    'Content-Length': body.length,
                },
                method: 'POST',
                mode: 'cors',
            }).catch(() => {
                /* Automatically triggers error in browser's console */
            });
        }
    }

    @action.bound
    async trackTransaction(elements) {
        const contracts = elements.filter(element => element.type === transaction_elements.CONTRACT);
        const contract = contracts[0]; // Most recent contract.

        if (contract?.type === transaction_elements.CONTRACT) {
            const { buy: buy_id } = contract.data.transaction_ids;

            if (!this.transaction_ids.includes(buy_id)) {
                this.transaction_ids.push(buy_id);
            }
        }
    }

    /**
     * Generates a unique run id.
     * This value should be unique on each run button click.
     * @param {String} xml_string
     */
    generateRunId(xml_string) {
        return crc32.str(xml_string + this.root_store.core.client.loginid + Math.random());
    }

    getRunId() {
        return this.run_id;
    }

    setRunId(run_id) {
        this.run_id = run_id;
    }
}

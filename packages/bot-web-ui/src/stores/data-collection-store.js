import { action, reaction } from 'mobx';
import crc32 from 'crc-32/crc32';
import { DBot } from '@deriv/bot-skeleton';
import { transaction_elements } from '../constants/transactions';

export default class DataCollectionStore {
    constructor(root_store) {
        this.root_store = root_store;
        this.endpoint = 'http://192.168.19.61:8000/dbotconf';
        this.transaction_ids = [];
        this.pako = null;

        const { run_panel, transactions } = this.root_store;

        reaction(
            () => run_panel.is_running,
            () => (run_panel.is_running ? this.trackRun() : undefined)
        );
        reaction(
            () => transactions.elements,
            elements => this.trackTransaction(elements)
        );
    }

    @action.bound
    async trackRun() {
        if (!this.pako) {
            this.pako = await import(/* webpackChunkName: "pako" */ 'pako');
            console.log(this.pako);
        }

        const xml_string = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(DBot.workspace));
        const run_id = this.generateRunId(xml_string);

        this.setRunId(run_id);

        fetch(`${this.endpoint}/${this.getRunId()}`, {
            body: xml_string,
            headers: {
                'Content-Type': 'text/plain',
                // 'Content-Length': xml_string.length,
            },
            method: 'POST',
            mode: 'no-cors',
        }).then(() => {});
    }

    @action.bound
    async trackTransaction(elements) {
        const contracts = elements.filter(element => element.type === transaction_elements.CONTRACT);
        const contract = contracts[0]; // Most recent contract.

        if (contract && contract.type === transaction_elements.CONTRACT) {
            const { buy: buy_id } = contract.data.transaction_ids;

            if (!this.transaction_ids.includes(buy_id)) {
                this.transaction_ids.push(buy_id);
            }
        }
    }

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

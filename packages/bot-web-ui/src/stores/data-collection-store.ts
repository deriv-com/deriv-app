import crc32 from 'crc-32/crc32';
import { action, makeObservable, observable, reaction } from 'mobx';
import { DBot } from '@deriv/bot-skeleton';
import { cloneObject, isProduction } from '@deriv/shared';
import RootStore from './root-store';
import { TStores } from '@deriv/stores/types';

export default class DataCollectionStore {
    root_store: RootStore;
    core: TStores;
    constructor(root_store: RootStore, core: TStores) {
        makeObservable(this, {
            IS_PENDING: observable,
            IS_PROCESSED: observable,
            endpoint: observable,
            run_id: observable,
            run_start: observable,
            should_post_xml: observable,
            strategy_content: observable,
            transaction_ids: observable,
            trackRun: action.bound,
            trackTransaction: action.bound,
            setRunId: action.bound,
            setRunStart: action.bound,
            setStrategyContent: action.bound,
            cleanXmlDom: action.bound,
            getHash: action.bound,
        });
        this.root_store = root_store;
        this.core = core;
        if (isProduction() || /(.*?)\.binary.sx$/.test(window.location.hostname)) {
            this.root_store = root_store;

            reaction(
                () => this.root_store.run_panel.is_running,
                () => (this.root_store.run_panel.is_running ? this.trackRun() : undefined)
            );
            reaction(
                () => this.root_store.transactions.transactions,
                transactions => {
                    if (this.run_id) this.trackTransaction(transactions);
                }
            );
        }
    }

    // Constants
    IS_PENDING = false;
    IS_PROCESSED = true;

    endpoint = 'https://dbot-conf-dot-deriv-bi-reporting.as.r.appspot.com/dbotconf';
    run_id = '';
    run_start = 0;
    should_post_xml = true;
    strategy_content = '';
    transaction_ids: Record<string, unknown> = {};

    async trackRun() {
        const xml_dom = this.cleanXmlDom(Blockly.Xml.workspaceToDom(DBot.workspace, /* opt_noId */ true));
        const xml_string = Blockly.Xml.domToText(xml_dom);
        const xml_hash = this.getHash(xml_string);

        if (this.getHash(this.strategy_content) !== xml_hash) {
            this.should_post_xml = true;
            this.setStrategyContent(xml_string);
        }

        this.setRunId(this.getHash(xml_hash + this.core.client.loginid + Math.random()));
        this.setRunStart(this.core.common.server_time.unix());
    }

    async trackTransaction(
        contracts: {
            data: {
                transaction_ids: {
                    buy: number;
                };
            };
        }[]
    ) {
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

            fetch(
                `${this.endpoint}/${this.run_id}/${transaction_id}/${this.run_start}/${this.getHash(
                    this.strategy_content
                )}`,
                {
                    ...(this.should_post_xml ? getPayload() : {}),
                    method: 'POST',
                    mode: 'no-cors',
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

    setRunId(run_id: string) {
        this.run_id = run_id;
    }

    setRunStart(timestamp: number) {
        this.run_start = timestamp;
    }

    setStrategyContent(strategy_content: string) {
        this.strategy_content = strategy_content;
    }

    cleanXmlDom = (xml_dom: XMLDocument) => {
        const useless_attributes = ['x', 'y', 'id'];
        const updated_dom = cloneObject(xml_dom);
        const removeAttributesRecursively = (element: Element) => {
            useless_attributes.forEach(useless_attribute => element.removeAttribute(useless_attribute));
            Array.from(element.children).forEach(child => removeAttributesRecursively(child));
        };

        removeAttributesRecursively(updated_dom);
        return updated_dom;
    };

    getHash = (string: string) => btoa(String(crc32.str(string)));
}

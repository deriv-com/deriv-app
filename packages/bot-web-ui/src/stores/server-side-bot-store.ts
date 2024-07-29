import { action, makeObservable, observable } from 'mobx';
import { TBotListItem } from 'src/pages/server-bot/request_schema';
import { api_base } from '@deriv/bot-skeleton';
import RootStore from './root-store';
import { ProposalOpenContract } from '@deriv/api-types';
import { botNotification } from 'Components/bot-notification/bot-notification';

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TServerBotItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

export type TServerBotTransaction = {
    display_name: string;
    profit: string;
    purchase_time: string;
};

const isValidJSON = (text: string) => {
    try {
        JSON.parse(text);
        return true; // The string is valid JSON
    } catch (error) {
        return false; // The string is not valid JSON
    }
};

const getAPI = async () => {
    let interval = null;

    return new Promise(resolve => {
        interval = setInterval(() => {
            if (api_base?.api) {
                clearInterval(interval);
                return resolve(api_base.api);
            }
        }, 10);
    });
};

// STRUCTURE of the transactions object:
// transactions: {
//     [bot_id]: {
//         [contract_id]: ProposalOpenContract[],
//     },
// };

export type TBotTransactions = {
    [key: string]: {
        [key: string]: ProposalOpenContract;
    };
};

export type TJournalItem = {
    type: string; // BUY | PROFIT | LOSS | INFO
    msg?: string;
    amount?: string;
};

export default class ServerBotStore {
    root_store: RootStore;
    is_loading_bot_list = true;
    active_bot_id = '';
    bot_list: TServerBotItem[] = [];
    active_bot: Partial<TServerBotItem> = {};

    transactions: TBotTransactions = {};
    journal: TJournalItem[] = [];

    pocs: { [key: string]: ProposalOpenContract } = {};

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        makeObservable(this, {
            is_loading_bot_list: observable,
            active_bot_id: observable,
            bot_list: observable,
            transactions: observable,
            active_bot: observable,
            pocs: observable,
            journal: observable,

            setListLoading: action,
            getBotList: action,
            subscribeToBotNotification: action,
            createBot: action,
            deleteBot: action,
            startBot: action,
            stopBot: action,
            setTransaction: action,
            resetTransactions: action,
            handleProposalOpenContract: action,
            resetJournal: action,
            setJournalItem: action,
        });
    }

    handleProposalOpenContract = (poc: ProposalOpenContract) => {
        this.pocs = {
            ...this.pocs,
            [String(poc.contract_id)]: poc,
        };
    };

    onMessage = ({ data }) => {
        const { msg_type, echo_req } = data;

        if (data?.error) {
            // eslint-disable-next-line no-console
            console.dir(data.error);
            return;
        }
        try {
            if (msg_type === 'proposal_open_contract') {
                this.handleProposalOpenContract(data.proposal_open_contract);
            }

            if (msg_type === 'bot_notification') {
                const { message } = data.bot_notification;
                const { bot_id } = echo_req;

                if (isValidJSON(message)) {
                    const { msg, msg_type } = JSON.parse(message);

                    if (msg_type === 'poc') {
                        this.setTransaction(msg, bot_id);
                    }

                    if (msg_type === 'transaction' && msg?.action === 'buy') {
                        this.setJournalItem('BUY', msg, bot_id);
                    }

                    if (msg_type === 'transaction' && msg?.action === 'sell') {
                        this.setJournalItem('SELL', msg, bot_id);
                    }

                    if (msg_type === 'stop') {
                        this.setJournalItem('STOP', msg, bot_id);
                    }
                }
            }
            // test
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    setJournalItem = (type: string, journal: any, bot_id: string) => {
        // eslint-disable-next-line no-console
        if (type === 'BUY') {
            const contract_id = journal.contract_id;
            // eslint-disable-next-line no-console
            console.log(this.pocs, 'pocs');
            const poc = this.pocs[String(contract_id)];
            // eslint-disable-next-line no-console
            console.log(poc, 'poc');
            if (poc) {
                const journal_item = {
                    type: 'BUY',
                    msg: poc?.longcode,
                };
                this.journal = [...this.journal, journal_item];
            }
        } else {
            // eslint-disable-next-line no-console
            console.log(journal, bot_id, 'setJournalItem');
        }
    };

    resetJournal = () => {
        // eslint-disable-next-line no-console
        console.log('resetJournal');
    };

    downloadJournal = async (bot_id: string) => {
        try {
            const { download_bot_reports, error } = await api_base.api.send({
                download_bot_reports: 1,
                bot_id,
            });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            // eslint-disable-next-line no-console
            console.log('DOWNLOAD_BOT_REPORTS', download_bot_reports);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        } finally {
            // test
        }
    };

    setTransaction = (poc: ProposalOpenContract, bot_id: string) => {
        if (poc.contract_id) {
            this.transactions = {
                ...this.transactions,
                [bot_id]: {
                    ...this.transactions[bot_id],
                    [poc.contract_id]: poc,
                },
            };
        }
    };

    resetTransactions = () => {
        this.transactions = {};
    };

    getBotList = async (should_subscribe?: boolean) => {
        try {
            this.setListLoading(true);
            await getAPI();
            // eslint-disable-next-line no-console
            console.log('CONNECTION ESTABLISHED');
            await api_base.api.expectResponse('authorize');
            // eslint-disable-next-line no-console
            console.log('AUTHORIZATION SUCCESSFUL');

            // SUBSCRIBE: to bot notification
            if (should_subscribe) api_base.api?.onMessage()?.subscribe(this.onMessage);

            const { bot_list, error } = await api_base.api.send({ bot_list: 1 });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            this.bot_list = bot_list.bot_list;
            const running_bot = this.bot_list.find(bot => bot.status === 'running');
            if (running_bot?.bot_id) {
                this.active_bot = running_bot;
                this.subscribeToBotNotification(running_bot?.bot_id);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        } finally {
            this.setListLoading(false);
        }
    };

    setListLoading = (is_loading_bot_list: boolean) => {
        this.is_loading_bot_list = is_loading_bot_list;
    };

    subscribeToBotNotification = async (bot_id: string) => {
        try {
            await api_base.api.send({ bot_notification: 1, bot_id, subscribe: 1 });
            // eslint-disable-next-line no-console
            console.log('SUBSCRIBED : ', bot_id);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    createBot = async (data: TFormData) => {
        try {
            const { bot_create, error } = await api_base.api.send({
                bot_create: 1,
                data: {
                    name: data.name,
                    strategy: 'martingale',
                    contract_parameters: {
                        amount: data.stake,
                        basis: 'stake',
                        contract_type: data.type,
                        currency: 'USD',
                        duration: data.duration,
                        duration_unit: data.durationtype,
                        symbol: data.symbol,
                    },
                    parameters: {
                        initial_stake: data.stake,
                        size: data.size,
                        stop_loss: data.loss,
                        take_profit: data.profit,
                    },
                },
            });

            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            // eslint-disable-next-line no-console
            console.log('BOT_CREATE', bot_create);
            this.getBotList(false);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    deleteBot = async (bot_id: string) => {
        try {
            const { bot_remove, error } = await api_base.api.send({
                bot_remove: 1,
                bot_id,
            });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }

            this.getBotList(false);
            botNotification(bot_remove.message);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    startBot = async (bot_id: string) => {
        try {
            this.active_bot = {
                bot_id,
                status: 'starting',
            };
            this.subscribeToBotNotification(bot_id);
            const { bot_start, error } = await api_base.api.send({
                bot_start: 1,
                bot_id,
            });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            const bot_list = [...this.bot_list];
            const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
            bot_list[index].status = 'running';
            this.bot_list = bot_list;
            this.active_bot = bot_list[index];

            // eslint-disable-next-line no-console
            console.log('bot_start', bot_start);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    stopBot = async (bot_id: string) => {
        try {
            this.active_bot = {
                ...this.active_bot,
                status: 'stopping',
            };

            const { bot_stop, error } = await api_base.api.send({
                bot_stop: 1,
                bot_id,
            });

            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            const bot_list = [...this.bot_list];
            const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
            bot_list[index].status = 'stopped';
            this.bot_list = bot_list;
            this.active_bot = {
                ...this.active_bot,
                status: 'stopped',
            };
            // eslint-disable-next-line no-console
            console.log('bot_stop', bot_stop);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };
}

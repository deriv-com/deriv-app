import { action, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { ProposalOpenContract } from '@deriv/api-types';
import { api_base } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import RootStore from './root-store';

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

export const JOURNAL_TYPE = Object.freeze({
    BUY: 'BUY',
    LOSS: 'LOSS',
    WON: 'WON',
    INFO: 'INFO',
    ERROR: 'ERROR',
});

export type TJournalOptions = {
    msg?: string;
    amount?: string;
    bot_id?: string;
    contract_id?: string;
    time?: string;
};

export type TBotTransactions = {
    [key: string]: {
        [key: string]: ProposalOpenContract;
    };
};

export type TJournalItem = {
    type: typeof JOURNAL_TYPE[keyof typeof JOURNAL_TYPE];
    msg?: string;
    amount?: string;
    bot_id?: string;
    time?: string;
};

export const getDate = (epoch: number) => {
    const DATE_TIME_FORMAT_WITH_OFFSET = 'YYYY-MM-DD HH:mm:ss Z';
    return moment.unix(epoch).utc().local().format(DATE_TIME_FORMAT_WITH_OFFSET);
};

type TPerformance = {
    total_stake: number;
    total_payout: number;
    total_profit: number;
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

    performance: TPerformance = {
        total_stake: 0,
        total_payout: 0,
        total_profit: 0,
    };

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
            performance: observable,

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
            onJournalMessage: action,
            setJournal: action,
            setBotList: action,
        });
    }

    handleProposalOpenContract = (poc: ProposalOpenContract) => {
        if (poc.contract_id) return;
        this.pocs = {
            ...this.pocs,
            [String(poc.contract_id)]: poc,
        };
    };

    onMessage = ({ data }) => {
        const { msg_type, echo_req } = data;

        if (data?.error) {
            // eslint-disable-next-line no-console
            console.info(data.error);
            this.onJournalMessage(JOURNAL_TYPE.ERROR, {
                msg: data.error.message,
            });
        }
        try {
            if (msg_type === 'proposal_open_contract' && !data.error) {
                // eslint-disable-next-line no-console
                // console.log(data.proposal_open_contract, 'proposal_open_contract');
                this.handleProposalOpenContract(data.proposal_open_contract);
            }

            if (msg_type === 'bot_notification') {
                const { message, error } = data.bot_notification;

                if (error) {
                    // eslint-disable-next-line no-console
                    console.info(error, 'BOT SERVER ERROR');
                    return;
                }
                const { bot_id } = echo_req;

                if (isValidJSON(message)) {
                    const { msg, msg_type } = JSON.parse(message);

                    // // eslint-disable-next-line no-console
                    // console.log(msg);

                    if (msg_type === 'poc') {
                        // this.onJournalMessage(JOURNAL_TYPE.BUY, {
                        //     msg: msg.longcode,
                        //     bot_id,
                        //     // time: getDate();
                        // });

                        const transactions = this.transactions[bot_id];
                        if (transactions && !(msg?.contract_id in transactions)) {
                            this.onJournalMessage(JOURNAL_TYPE.BUY, {
                                msg: msg.longcode,
                                bot_id,
                                // time: getDate();
                            });
                        }

                        this.setTransaction(msg, bot_id);
                    }

                    if (msg_type === 'transaction' && msg?.action === 'buy') {
                        // eslint-disable-next-line no-console
                        console.log(msg, 'buy');
                        this.onJournalMessage(JOURNAL_TYPE.BUY, { msg: msg.contract_id, bot_id });
                        // this.performance = {
                        //     ...this.performance,
                        //     total_stake: this.performance.total_stake + Number(msg.price),
                        // };
                    }

                    if (msg_type === 'transaction' && msg?.action === 'sell') {
                        // eslint-disable-next-line no-console
                        console.log(msg, 'sell');
                        this.onJournalMessage(JOURNAL_TYPE.BUY, { msg: msg.contract_id, bot_id });

                        // this.performance = {
                        //     ...this.performance,
                        //     total_payout: this.performance.total_payout + Number(msg.payout),
                        // };
                    }

                    if (msg_type === 'stop') {
                        const { reason } = msg;
                        // eslint-disable-next-line no-console
                        console.log(msg, 'STOP');
                        this.onJournalMessage(JOURNAL_TYPE.INFO, { msg: reason?.message, bot_id });
                    }
                }
            }
            // test
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };

    onJournalMessage = (type: string, options: TJournalOptions) => {
        const { msg = '', bot_id = '', amount = '', time = '' } = options;
        switch (type) {
            case JOURNAL_TYPE.INFO:
                this.setJournal({ type: JOURNAL_TYPE.INFO, msg });
                break;
            case JOURNAL_TYPE.ERROR:
                this.setJournal({ type: JOURNAL_TYPE.ERROR, msg });
                break;
            case JOURNAL_TYPE.BUY: {
                const journal_item = {
                    type: JOURNAL_TYPE.BUY,
                    msg,
                    time,
                };
                this.setJournal(journal_item);
                break;
            }

            case JOURNAL_TYPE.WON: {
                if (amount) {
                    this.setJournal({ type: JOURNAL_TYPE.WON, amount });
                }
                break;
            }
            case JOURNAL_TYPE.LOSS: {
                if (amount) {
                    this.setJournal({ type: JOURNAL_TYPE.LOSS, amount });
                }
                break;
            }

            default:
                // eslint-disable-next-line no-console
                console.log(options, bot_id, 'onJournalMessage');
        }
    };

    setJournal = (journal: TJournalItem) => {
        this.journal = [...this.journal, journal];
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
            const list = [...bot_list.bot_list];
            this.setBotList(list);
            const running_bot = list.find(bot => bot.status === 'running');

            if (running_bot?.bot_id) {
                this.active_bot = running_bot;
                this.subscribeToBotNotification(running_bot?.bot_id);
            }

            if (should_subscribe) {
                this.onJournalMessage(JOURNAL_TYPE.INFO, {
                    msg: localize('Bots loaded successfully.'),
                });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        } finally {
            this.setListLoading(false);
        }
    };

    setBotList = (bot_list: TServerBotItem[]) => {
        this.bot_list = [...bot_list];
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
            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                bot_id: bot_create.bot_id,
                msg: bot_create.message,
            });
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
            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg: bot_remove.message || localize('Bot deleted successfully.'),
                bot_id,
            });
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
            this.setBotList(bot_list);
            this.active_bot = bot_list[index];

            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg: bot_start?.message || localize('Bot started successfully.'),
                bot_id,
            });
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
            this.setBotList(bot_list);
            this.active_bot = {
                ...this.active_bot,
                status: 'stopped',
            };

            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg: bot_stop?.message || localize('Bot stopped successfully.'),
                bot_id,
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.dir(e);
        }
    };
}

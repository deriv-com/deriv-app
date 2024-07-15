import { action, makeObservable, observable } from 'mobx';
import { api_base } from '@deriv/bot-skeleton';
import { initial_req_schema, TBotListItem } from '../pages/server-bot/request_schema';
import RootStore from './root-store';

export type TFormData = {
    [key: string]: string | number | boolean;
};

const isValidJSON = (text: string) => {
    try {
        JSON.parse(text);
        return true; // The string is valid JSON
    } catch (error) {
        return false; // The string is not valid JSON
    }
};

export default class ServerBotStore {
    bot_list: TBotListItem[] = [];
    notifications: Array<string> = [];
    root_store: RootStore;
    form_data: TFormData = {};

    bot_starting_list: string[] = [];
    bot_running_list: string[] = [];
    contracts: any = {};

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        makeObservable(this, {
            bot_list: observable,
            notifications: observable,
            form_data: observable,
            bot_starting_list: observable,
            bot_running_list: observable,
            contracts: observable,

            setValueServerBot: action,
            setNotifications: action,
            setValue: action,
            getBotList: action,
            notifyBot: action,
            createBot: action,
            removeBot: action,
            startBot: action,
            stopBot: action,
            setFormValues: action,
            setStatusBot: action,

            setRunning: action,
            setStopped: action,
            handleMessage: action,
            setContracts: action,
            setStarting: action,
            removeFromStartingList: action,
            setBotList: action,
        });
    }

    setValue = (name: string, value: string | number | boolean) => {
        this.form_data[name as keyof TFormData] = value;
    };

    setValueServerBot = (form_data: any) => {
        this.form_data = form_data;
    };

    setFormValues = (currency: string) => {
        const data = JSON.parse(localStorage.getItem('server-form-fields') ?? '{}');

        const parameters = initial_req_schema.data.parameters;
        const contract_parameters = initial_req_schema.data.contract_parameters;

        Object.keys(data).forEach(key => {
            if (key === 'size' || key === 'take_profit' || key === 'stop_loss') {
                parameters[key] = data[key];
            }
            if (key === 'stake') {
                parameters.initial_stake = data.stake;
            }
            if (key === 'type') {
                contract_parameters.contract_type = data.type;
            }
            if (key === 'duration' || key === 'symbol' || key === 'duration_unit' || key === 'amount') {
                (contract_parameters[key] as string | number) = data[key];
            }
            if (key === 'currency') {
                contract_parameters[key] = data[currency || 'USD'];
            }
            this.setValue(key, data[key]);
        });
    };

    getBotList = async () => {
        try {
            const {
                bot_list: { bot_list },
                error,
            } = await api_base?.api?.send({
                bot_list: 1,
            });

            if (error) {
                this.setNotifications(error?.error?.message);
            }

            if (bot_list?.length) {
                api_base.api?.onMessage()?.subscribe(this.handleMessage);
                bot_list.forEach(bot => {
                    if (bot.status === 'running') this.setRunning(bot.bot_id);
                });
                this.setBotList(bot_list);
                return bot_list;
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error fetching bot list', e);
        }
    };

    setBotList = (bot_list: TBotListItem[]) => {
        this.bot_list = bot_list;
    };

    createBot = () => {
        api_base.api
            .send(initial_req_schema)
            .then(data => {
                this.setNotifications(data.bot_create.message);
                if (this.form_data.action === 'RUN') {
                    this.startBot(data?.bot_create?.bot_id);
                }
                return data;
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            })
            .then(() => this.getBotList());
    };

    removeBot = async (bot_id: string) => {
        this.setStarting(bot_id);
        try {
            const { bot_remove, error } = await api_base.api.send({
                bot_remove: 1,
                bot_id,
            });

            if (bot_remove) {
                this.setNotifications(bot_remove.message);
            }

            if (error) {
                console.error(error);
                this.setNotifications(error?.error?.message);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error removing bot', e);
        } finally {
            this.removeFromStartingList(bot_id);
            this.getBotList();
        }
    };

    startBot = async (bot_id: string) => {
        this.setStarting(bot_id);
        this.notifyBot(bot_id);
        try {
            const { bot_start, error } = await api_base.api.send({
                bot_start: 1,
                bot_id,
            });

            if (bot_start) {
                this.setNotifications(bot_start.message);
                this.setRunning(bot_id);
            }

            if (error) {
                console.error(error);
                this.setNotifications(error?.error?.message);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error starting bot', e);
        } finally {
            this.removeFromStartingList(bot_id);
        }
    };

    stopBot = async (bot_id: string) => {
        try {
            this.bot_starting_list.push(bot_id);
            const { bot_stop, error } = await api_base.api.send({
                bot_stop: 1,
                bot_id,
            });

            if (error) {
                this.setNotifications(error?.error?.message);
            }

            if (bot_stop) {
                this.setNotifications(bot_stop.message);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error stopping bot', e);
        } finally {
            this.bot_starting_list = this.bot_starting_list.filter(id => id !== bot_id);
        }
    };

    notifyBot = (bot_id: string) => {
        api_base.api
            .send({
                bot_notification: 1,
                subscribe: 1,
                bot_id,
            })
            .then(data => {
                this.setNotifications(data?.bot_notification?.message);
                return data;
            })
            .catch((error: Error) => {
                // eslint-disable-next-line no-console
                console.error(error);
                this.setNotifications(error?.error?.message);
            });
    };

    setRunning = (bot_id: string) => {
        this.bot_running_list.push(bot_id);
    };

    setStopped = (bot_id: string) => {
        this.bot_running_list = this.bot_running_list.filter(id => id !== bot_id);
    };

    setStarting = (bot_id: string) => {
        const bot_starting_list = [...this.bot_starting_list];
        bot_starting_list.push(bot_id);
        this.bot_starting_list = bot_starting_list;
    };

    removeFromStartingList = (bot_id: string) => {
        const bot_starting_list = [...this.bot_starting_list].filter(id => id !== bot_id);
        this.bot_starting_list = bot_starting_list;
    };

    setNotifications = (notifications: string) => {
        this.notifications.push(notifications);
    };

    setStatusBot = (status: string, bot_id: string) => {
        const list = [...this.bot_list].map(bot => (bot.bot_id === bot_id ? { ...bot, status } : bot));
        this.setBotList(list);
    };

    handleMessage = ({ data }) => {
        if (data?.error) {
            console.log(data?.error?.code, data?.error?.message);
            return data.error;
        }
        try {
            if (data?.msg_type === 'bot_notification') {
                const contract_ids = [];
                const { message } = data.bot_notification;

                if (isValidJSON(message)) {
                    const { msg, msg_type } = JSON.parse(message);
                    if (msg_type === 'transaction' && msg?.action === 'buy') {
                        this.setNotifications(
                            `msg_type: ${msg_type} action: ${msg.action} payout: ${msg.payout} price: ${msg.price}`
                        );
                        contract_ids.push(msg.contract_id);
                        this.setContracts({
                            ...this.contracts,
                            [msg.contract_id]: {
                                ...msg,
                                contract_id: msg.contract_id,
                            },
                        });
                    }

                    if (msg_type === 'transaction' && msg?.action === 'sell') {
                        // eslint-disable-next-line no-console
                        console.log(msg?.action, msg_type, msg, data);
                        this.setNotifications(
                            `msg_type: ${msg_type} action: ${msg.action} payout: ${msg.payout} price: ${msg.price} profit: ${msg.profit}`
                        );

                        this.setContracts({
                            ...this.contracts,
                            [msg.contract_id]: {
                                ...this.contracts[msg.contract_id],
                                profit: msg.profit,
                            },
                        });
                    }

                    if (msg_type === 'poc') {
                        this.setNotifications(
                            `${msg.longcode} barrier: ${msg?.barrier || ''} current_spot: ${msg.current_spot} payout: ${
                                msg.payout
                            } profit: ${msg.profit}`
                        );

                        this.setContracts({
                            ...this.contracts,
                            [msg.contract_id]: {
                                ...msg,
                                contract_id: msg.contract_id,
                            },
                        });
                    }

                    if (msg_type === 'stop') {
                        this.setStopped(data.echo_req.bot_id);
                        this.setStatusBot('stopped', data.echo_req.bot_id);
                        this.setNotifications(`msg_type: ${msg_type} reason: ${msg.reason}`);
                    }
                } else {
                    console.log('else', data, data.msg_type);
                    // test
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('error handling message', e);
        }
    };

    setContracts = (contracts: any) => {
        this.contracts = contracts;
    };
}

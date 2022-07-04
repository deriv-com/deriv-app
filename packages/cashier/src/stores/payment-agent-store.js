import { action, computed, observable, makeObservable } from 'mobx';
import { formatMoney, routes } from '@deriv/shared';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import VerificationStore from './verification-store';

export default class PaymentAgentStore {
    constructor({ WS, root_store }) {
        makeObservable(this, {
            list: observable,
            agents: observable,
            container: observable,
            error: observable,
            filtered_list: observable,
            is_name_selected: observable,
            is_withdraw: observable,
            is_try_withdraw_successful: observable,
            is_withdraw_successful: observable,
            confirm: observable,
            receipt: observable,
            selected_bank: observable,
            supported_banks: observable,
            active_tab_index: observable,
            all_payment_agent_list: observable,
            setActiveTabIndex: action.bound,
            setActiveTab: action.bound,
            is_payment_agent_visible: computed,
            getPaymentAgentList: action.bound,
            getPaymentAgentDetails: action.bound,
            addSupportedBank: action.bound,
            clearSuppertedBanks: action.bound,
            sortSupportedBanks: action.bound,
            setList: action.bound,
            clearList: action.bound,
            setPaymentAgentList: action.bound,
            filterPaymentAgentList: action.bound,
            onChangePaymentMethod: action.bound,
            setIsWithdraw: action.bound,
            setIsTryWithdrawSuccessful: action.bound,
            setIsWithdrawSuccessful: action.bound,
            setConfirmation: action.bound,
            setReceipt: action.bound,
            addPaymentAgent: action.bound,
            onMountPaymentAgentWithdraw: action.bound,
            requestTryPaymentAgentWithdraw: action.bound,
            resetPaymentAgent: action.bound,
            onMountPaymentAgentList: action.bound,
            setAllPaymentAgentList: action.bound,
            is_payment_agent_visible_in_onboarding: computed,
            requestPaymentAgentWithdraw: action.bound,
        });

        this.verification = new VerificationStore({ root_store, WS });
        this.root_store = root_store;
        this.WS = WS;
    }

    list = [];
    agents = [];
    container = Constants.containers.payment_agent;
    error = new ErrorStore();
    filtered_list = [];
    is_name_selected = true;
    is_withdraw = false;
    is_try_withdraw_successful = false;
    is_withdraw_successful = false;
    confirm = {};
    receipt = {};
    selected_bank = 0;
    supported_banks = [];
    active_tab_index = 0;
    all_payment_agent_list = [];

    setActiveTabIndex(index) {
        this.active_tab_index = index;
    }

    setActiveTab(index) {
        this.setActiveTabIndex(index);

        if (index === 1) {
            this.verification.sendVerificationEmail();
        }
    }

    get is_payment_agent_visible() {
        return !!(this.filtered_list.length || this.agents.length);
    }

    async getPaymentAgentList() {
        // wait for get_settings so residence gets populated in client-store
        // TODO: set residence in client-store from authorize so it's faster
        await this.WS.wait('get_settings');
        const { residence, currency } = this.root_store.client;
        return this.WS.authorized.paymentAgentList(residence, currency);
    }

    async getPaymentAgentDetails() {
        const { paymentagent_details } = await this.WS.authorized.paymentAgentDetails();
        return paymentagent_details;
    }

    addSupportedBank(bank) {
        const supported_bank_exists = this.supported_banks.find(
            supported_bank => supported_bank.value === bank.toLowerCase()
        );
        if (!supported_bank_exists) {
            this.supported_banks.push({ text: bank, value: bank.toLowerCase() });
        }
    }

    clearSuppertedBanks() {
        this.supported_banks = [];
    }

    sortSupportedBanks() {
        // sort supported banks alphabetically by value, the option 'All payment agents' with value 0 should be on top
        this.supported_banks.replace(
            this.supported_banks.slice().sort((a, b) => {
                if (a.value < b.value) {
                    return -1;
                }
                if (a.value > b.value) {
                    return 1;
                }
                return 0;
            })
        );
    }

    setList(pa_list) {
        this.list.push(pa_list);
    }

    clearList() {
        this.list = [];
    }

    async setPaymentAgentList(pa_list) {
        const payment_agent_list = pa_list || (await this.getPaymentAgentList());
        this.clearList();
        this.clearSuppertedBanks();
        // TODO: Once telephone, url and supported_banks removed from paymentagent_list.list we can remove them and just use the plural ones
        try {
            payment_agent_list.paymentagent_list?.list.forEach(payment_agent => {
                this.setList({
                    email: payment_agent.email,
                    phones: payment_agent?.phone_numbers || payment_agent?.telephone,
                    name: payment_agent.name,
                    supported_banks: payment_agent?.supported_payment_methods,
                    urls: payment_agent?.urls || payment_agent?.url,
                });
                const supported_banks_array = payment_agent?.supported_payment_methods.map(bank => bank.payment_method);
                supported_banks_array.forEach(bank => this.addSupportedBank(bank));
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        this.sortSupportedBanks();
    }

    filterPaymentAgentList(bank) {
        const { common } = this.root_store;
        if (bank) {
            this.filtered_list = [];
            this.list.forEach(payment_agent => {
                const supported_banks = payment_agent?.supported_banks;
                if (supported_banks) {
                    const is_string = typeof supported_banks === 'string';
                    const bank_index = is_string
                        ? supported_banks.toLowerCase().split(',').indexOf(bank)
                        : supported_banks.map(x => x.payment_method.toLowerCase()).indexOf(bank);

                    if (bank_index !== -1) this.filtered_list.push(payment_agent);
                }
            });
        } else {
            this.filtered_list = this.list;
        }
        if (!this.is_payment_agent_visible && window.location.pathname.endsWith(routes.cashier_pa)) {
            common.routeTo(routes.cashier_deposit);
        }
    }

    onChangePaymentMethod({ target }) {
        const value = target.value === '0' ? parseInt(target.value) : target.value;
        this.selected_bank = value;
        this.filterPaymentAgentList(value);
    }

    setIsWithdraw(is_withdraw = !this.is_withdraw) {
        this.is_withdraw = is_withdraw;
    }

    setIsTryWithdrawSuccessful(is_try_withdraw_successful) {
        this.error.setErrorMessage('');
        this.is_try_withdraw_successful = is_try_withdraw_successful;
    }

    setIsWithdrawSuccessful(is_withdraw_successful) {
        this.is_withdraw_successful = is_withdraw_successful;
    }

    setConfirmation({ amount, currency, loginid, payment_agent_name }) {
        this.confirm = {
            amount,
            currency,
            loginid,
            payment_agent_name,
        };
    }

    setReceipt({
        amount_transferred,
        payment_agent_email,
        payment_agent_id,
        payment_agent_name,
        payment_agent_phone,
        payment_agent_url,
    }) {
        this.receipt = {
            amount_transferred,
            payment_agent_email,
            payment_agent_id,
            payment_agent_name,
            payment_agent_phone,
            payment_agent_url,
        };
    }

    addPaymentAgent(payment_agent) {
        this.agents.push({
            text: payment_agent.name,
            value: payment_agent.paymentagent_loginid,
            max_withdrawal: payment_agent.max_withdrawal,
            min_withdrawal: payment_agent.min_withdrawal,
            email: payment_agent.email,
            phone: payment_agent.telephone,
            url: payment_agent.url,
        });
    }

    async onMountPaymentAgentWithdraw() {
        const { common, modules } = this.root_store;
        const { setLoading, onMountCommon } = modules.cashier.general_store;

        setLoading(true);
        this.onRemount = this.onMountPaymentAgentWithdraw;
        onMountCommon();

        this.setIsWithdraw(true);
        this.setIsWithdrawSuccessful(false);
        this.setReceipt({});

        if (!this.agents.length) {
            const payment_agent_list = await this.getPaymentAgentList();
            payment_agent_list.paymentagent_list.list.forEach(payment_agent => {
                this.addPaymentAgent(payment_agent);
            });
            if (
                !payment_agent_list.paymentagent_list.list.length &&
                window.location.pathname.endsWith(routes.cashier_pa)
            ) {
                common.routeTo(routes.cashier_deposit);
            }
        }
        setLoading(false);
    }

    async requestTryPaymentAgentWithdraw({ loginid, currency, amount, verification_code }) {
        this.error.setErrorMessage('');
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid,
            currency,
            amount,
            verification_code,
            dry_run: 1,
        });
        if (+payment_agent_withdraw.paymentagent_withdraw === 2) {
            const selected_agent = this.agents.find(agent => agent.value === loginid);
            this.setConfirmation({
                amount,
                currency,
                loginid,
                ...(selected_agent && { payment_agent_name: selected_agent.text }),
            });
            this.setIsTryWithdrawSuccessful(true);
        } else {
            this.error.setErrorMessage(payment_agent_withdraw.error, this.resetPaymentAgent);
        }
    }

    resetPaymentAgent = () => {
        this.error.setErrorMessage('');
        this.setIsWithdraw(false);
        this.verification.clearVerification();
        this.setActiveTabIndex(0);
    };

    async onMountPaymentAgentList() {
        const { setLoading, onMountCommon } = this.root_store.modules.cashier.general_store;

        setLoading(true);
        this.onRemount = this.onMountPaymentAgentList;
        await onMountCommon();
        await this.getPaymentAgentList();

        setLoading(false);
    }

    async getAllPaymentAgentList() {
        await this.WS.wait('get_settings');
        return this.WS.allPaymentAgentList(this.root_store.client.residence);
    }

    setAllPaymentAgentList(list) {
        this.all_payment_agent_list = list;
    }

    get is_payment_agent_visible_in_onboarding() {
        return !!this.all_payment_agent_list?.paymentagent_list?.list?.length;
    }

    async requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code }) {
        this.error.setErrorMessage('');
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid,
            currency,
            amount,
            verification_code,
        });
        if (+payment_agent_withdraw.paymentagent_withdraw === 1) {
            const selected_agent = this.agents.find(agent => agent.value === loginid);
            this.setReceipt({
                amount_transferred: formatMoney(currency, amount, true),
                ...(selected_agent && {
                    payment_agent_email: selected_agent.email,
                    payment_agent_id: selected_agent.value,
                    payment_agent_name: selected_agent.text,
                    payment_agent_phone: selected_agent.phone,
                    payment_agent_url: selected_agent.url,
                }),
                ...(!selected_agent && {
                    payment_agent_id: loginid,
                }),
            });
            this.setIsWithdrawSuccessful(true);
            this.setIsTryWithdrawSuccessful(false);
            this.setConfirmation({});
        } else {
            this.error.setErrorMessage(payment_agent_withdraw.error, this.resetPaymentAgent);
        }
    }
}

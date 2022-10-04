import { action, computed, observable, IObservableArray } from 'mobx';
import { PaymentAgentDetailsResponse } from '@deriv/api-types';
import { formatMoney, routes } from '@deriv/shared';
import Constants from 'Constants/constants';
import ErrorStore from './error-store';
import VerificationStore from './verification-store';
import {
    TAgent,
    TExtendedPaymentAgentList,
    TExtendedPaymentAgentListResponse,
    TPartialPaymentAgentList,
    TPaymentAgentWithdrawConfirm,
    TPaymentAgentWithdrawRequest,
    TPaymentAgentWithdrawReceipt,
    TRootStore,
    TServerError,
    TSupportedBank,
    TTarget,
    TWebSocket,
} from 'Types';

export default class PaymentAgentStore {
    constructor(public WS: TWebSocket, public root_store: TRootStore) {
        this.root_store = root_store;
        this.WS = WS;
    }

    @observable list: IObservableArray<TPartialPaymentAgentList> | [] = [];
    @observable agents: IObservableArray<TAgent> | [] = [];
    @observable container = Constants.containers.payment_agent;
    @observable error: TRootStore['modules']['cashier']['error'] = new ErrorStore();
    @observable filtered_list: IObservableArray<TPartialPaymentAgentList> | [] = [];
    @observable is_name_selected = true;
    @observable is_withdraw = false;
    @observable is_try_withdraw_successful = false;
    @observable is_withdraw_successful = false;
    @observable confirm: TPaymentAgentWithdrawConfirm = {};
    @observable receipt: TPaymentAgentWithdrawReceipt = {};
    @observable selected_bank: number | string = 0;
    @observable supported_banks: IObservableArray<TSupportedBank> | [] = [];
    @observable verification = new VerificationStore({ root_store: this.root_store, WS: this.WS });
    @observable active_tab_index = 0;
    @observable all_payment_agent_list: TExtendedPaymentAgentListResponse | null = null;
    @observable onRemount: VoidFunction | null = null;

    @action.bound
    setOnRemount(func: VoidFunction): void {
        this.onRemount = func;
    }

    @action.bound
    setActiveTabIndex(index: number): void {
        this.active_tab_index = index;
    }

    @action.bound
    setActiveTab(index: number): void {
        this.setActiveTabIndex(index);

        if (index === 1) {
            this.verification.sendVerificationEmail();
        }
    }

    @computed
    get is_payment_agent_visible(): boolean {
        return !!(this.filtered_list.length || this.agents.length);
    }

    @action.bound
    async getPaymentAgentList(): Promise<TExtendedPaymentAgentListResponse> {
        // wait for get_settings so residence gets populated in client-store
        // TODO: set residence in client-store from authorize so it's faster
        await this.WS.wait('get_settings');
        const { residence, currency } = this.root_store.client;
        return this.WS.authorized.paymentAgentList(residence, currency);
    }

    @action.bound
    async getPaymentAgentDetails(): Promise<PaymentAgentDetailsResponse['paymentagent_details']> {
        const { paymentagent_details } = await this.WS.authorized.paymentAgentDetails();
        return paymentagent_details;
    }

    @action.bound
    addSupportedBank(bank: string): void {
        const supported_bank_exists = this.supported_banks.find(
            supported_bank => supported_bank.value === bank.toLowerCase()
        );
        if (!supported_bank_exists) {
            (this.supported_banks as IObservableArray<TSupportedBank>).push({ text: bank, value: bank.toLowerCase() });
        }
    }

    @action.bound
    clearSupportedBanks(): void {
        this.supported_banks = [];
    }

    @action.bound
    sortSupportedBanks(): void {
        // sort supported banks alphabetically by value, the option 'All payment agents' with value 0 should be on top
        (this.supported_banks as IObservableArray<TSupportedBank>).replace(
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

    @action.bound
    setList(pa_list: TPartialPaymentAgentList): void {
        (this.list as IObservableArray<TPartialPaymentAgentList>).push(pa_list);
    }

    @action.bound
    clearList(): void {
        this.list = [];
    }

    @action.bound
    async setPaymentAgentList(): Promise<void> {
        const payment_agent_list = await this.getPaymentAgentList();
        this.clearList();
        this.clearSupportedBanks();
        try {
            payment_agent_list.paymentagent_list?.list.forEach(payment_agent => {
                this.setList({
                    email: payment_agent.email,
                    phones: payment_agent?.phone_numbers,
                    name: payment_agent.name,
                    supported_banks: payment_agent?.supported_payment_methods,
                    urls: payment_agent?.urls,
                });
                const supported_banks_array = payment_agent?.supported_payment_methods.map(bank => bank.payment_method);
                supported_banks_array.forEach(bank => bank && this.addSupportedBank(bank));
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }

        this.sortSupportedBanks();
    }

    @action.bound
    filterPaymentAgentList(bank?: number | string): void {
        if (bank && typeof bank === 'string') {
            this.filtered_list = [];
            this.list.forEach(payment_agent => {
                const supported_banks = payment_agent?.supported_banks;
                if (supported_banks) {
                    const bank_index = supported_banks.map(x => x.payment_method.toLowerCase()).indexOf(bank);
                    if (bank_index !== -1)
                        (this.filtered_list as IObservableArray<TPartialPaymentAgentList>).push(payment_agent);
                }
            });
        } else {
            this.filtered_list = this.list;
        }
    }

    @action.bound
    onChangePaymentMethod({ target }: TTarget): void {
        const value = target.value === '0' ? parseInt(target.value) : target.value;
        this.selected_bank = value;
        this.filterPaymentAgentList(value);
    }

    @action.bound
    setIsWithdraw(is_withdraw = !this.is_withdraw): void {
        this.is_withdraw = is_withdraw;
    }

    @action.bound
    setIsTryWithdrawSuccessful(is_try_withdraw_successful: boolean): void {
        this.error.setErrorMessage({ code: '', message: '' });
        this.is_try_withdraw_successful = is_try_withdraw_successful;
    }

    @action.bound
    setIsWithdrawSuccessful(is_withdraw_successful: boolean): void {
        this.is_withdraw_successful = is_withdraw_successful;
    }

    @action.bound
    setConfirmation({ amount, currency, loginid, payment_agent_name }: TPaymentAgentWithdrawConfirm): void {
        this.confirm = {
            amount,
            currency,
            loginid,
            payment_agent_name,
        };
    }

    @action.bound
    setReceipt({
        amount_transferred,
        payment_agent_email,
        payment_agent_id,
        payment_agent_name,
        payment_agent_phone,
        payment_agent_url,
    }: TPaymentAgentWithdrawReceipt): void {
        this.receipt = {
            amount_transferred,
            payment_agent_email,
            payment_agent_id,
            payment_agent_name,
            payment_agent_phone,
            payment_agent_url,
        };
    }

    @action.bound
    addPaymentAgent(payment_agent: TExtendedPaymentAgentList[0]): void {
        (this.agents as IObservableArray<TAgent>).push({
            text: payment_agent.name,
            value: payment_agent.paymentagent_loginid,
            max_withdrawal: payment_agent.max_withdrawal,
            min_withdrawal: payment_agent.min_withdrawal,
            email: payment_agent.email,
            phone: payment_agent.phone_numbers,
            url: payment_agent.urls,
        });
    }

    @action.bound
    async onMountPaymentAgentWithdraw(): Promise<void> {
        const { common, modules } = this.root_store;
        const { setLoading, onMountCommon } = modules.cashier.general_store;

        setLoading(true);
        this.setOnRemount(this.onMountPaymentAgentWithdraw);
        onMountCommon();

        this.setIsWithdraw(true);
        this.setIsWithdrawSuccessful(false);
        this.setReceipt({});

        if (!this.agents.length) {
            const payment_agent_list = await this.getPaymentAgentList();
            payment_agent_list.paymentagent_list?.list.forEach(payment_agent => {
                this.addPaymentAgent(payment_agent);
            });
            if (
                !payment_agent_list.paymentagent_list?.list.length &&
                window.location.pathname.endsWith(routes.cashier_pa)
            ) {
                common.routeTo(routes.cashier_deposit);
            }
        }
        setLoading(false);
    }

    @action.bound
    async requestTryPaymentAgentWithdraw({
        loginid,
        currency,
        amount,
        verification_code,
    }: TPaymentAgentWithdrawRequest): Promise<void> {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid,
            currency,
            amount,
            verification_code,
            dry_run: 1,
        });

        if (Number(payment_agent_withdraw?.paymentagent_withdraw) === 2) {
            const selected_agent = this.agents.find(agent => agent.value === loginid);
            this.setConfirmation({
                amount,
                currency,
                loginid,
                ...(selected_agent && { payment_agent_name: selected_agent.text }),
            });
            this.setIsTryWithdrawSuccessful(true);
        } else {
            this.error.setErrorMessage(payment_agent_withdraw.error as TServerError, this.resetPaymentAgent);
        }
    }

    @action.bound
    resetPaymentAgent = (): void => {
        this.error.setErrorMessage({ code: '', message: '' });
        this.setIsWithdraw(false);
        this.verification.clearVerification();
        this.setActiveTabIndex(0);
    };

    @action.bound
    async onMountPaymentAgentList(): Promise<void> {
        const { setLoading, onMountCommon } = this.root_store.modules.cashier.general_store;

        setLoading(true);
        this.setOnRemount(this.onMountPaymentAgentList);
        await onMountCommon();
        await this.getPaymentAgentList();

        setLoading(false);
    }

    async getAllPaymentAgentList(): Promise<TExtendedPaymentAgentListResponse> {
        await this.WS.wait('get_settings');
        return this.WS.allPaymentAgentList(this.root_store.client.residence);
    }

    @action.bound
    setAllPaymentAgentList(list: TExtendedPaymentAgentListResponse): void {
        this.all_payment_agent_list = list;
    }

    @computed
    get is_payment_agent_visible_in_onboarding(): boolean {
        return !!this.all_payment_agent_list?.paymentagent_list?.list?.length;
    }

    @action.bound
    async requestPaymentAgentWithdraw({
        loginid,
        currency,
        amount,
        verification_code,
    }: TPaymentAgentWithdrawRequest): Promise<void> {
        this.error.setErrorMessage({ code: '', message: '' });
        const payment_agent_withdraw = await this.WS.authorized.paymentAgentWithdraw({
            loginid,
            currency,
            amount,
            verification_code,
        });
        if (Number(payment_agent_withdraw?.paymentagent_withdraw) === 1) {
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
            this.error.setErrorMessage(payment_agent_withdraw.error as TServerError, this.resetPaymentAgent);
        }
    }
}

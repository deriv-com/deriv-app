import { action, observable } from 'mobx';
import { getDecimalPlaces } from '@deriv/shared';
import { TRootStore, TWebSocket } from 'Types';

export default class CryptoFiatConverterStore {
    // eslint-disable-next-line no-useless-constructor
    constructor(public WS: TWebSocket, public root_store: TRootStore) {}

    @observable converter_from_amount = 0;
    @observable converter_to_amount = 0;
    @observable converter_from_error = '';
    @observable converter_to_error = '';
    @observable is_timer_visible = false;

    @action.bound
    setConverterFromAmount(amount: number): void {
        this.converter_from_amount = amount;
    }

    @action.bound
    setConverterToAmount(amount: number): void {
        this.converter_to_amount = amount;
    }

    @action.bound
    setConverterFromError(error: string): void {
        this.converter_from_error = error;
    }

    @action.bound
    setConverterToError(error: string): void {
        this.converter_to_error = error;
    }

    @action.bound
    setIsTimerVisible(is_timer_visible: boolean): void {
        this.is_timer_visible = is_timer_visible;
    }

    @action.bound
    resetTimer(): void {
        this.setIsTimerVisible(false);
    }

    @action.bound
    async getExchangeRate(from_currency: string, to_currency: string) {
        const { exchange_rates } = await this.WS.send?.({
            exchange_rates: 1,
            base_currency: from_currency,
        });
        return exchange_rates.rates[to_currency];
    }

    @action.bound
    validateFromAmount() {
        const { account_transfer, general_store, withdraw } = this.root_store.modules.cashier;

        if (general_store.active_container === account_transfer.container) {
            account_transfer.validateTransferFromAmount();
        } else {
            withdraw.validateWithdrawFromAmount();
        }
    }

    @action.bound
    validateToAmount() {
        const { account_transfer, general_store, withdraw } = this.root_store.modules.cashier;

        if (general_store.active_container === account_transfer.container) {
            account_transfer.validateTransferToAmount();
        } else {
            withdraw.validateWithdrawToAmount();
        }
    }

    @action.bound
    async onChangeConverterFromAmount(
        { target }: { target: { value: number } },
        from_currency?: string,
        to_currency?: string
    ): Promise<void> {
        const { account_transfer, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterFromAmount(target.value);
            this.validateFromAmount();
            general_store.percentageSelectorSelectionStatus(true);
            general_store.calculatePercentage();
            if (this.converter_from_error) {
                this.setConverterToAmount(0);
                this.setConverterToError('');
                this.setIsTimerVisible(false);
                account_transfer.setAccountTransferAmount(0);
            } else {
                const rate = await this.getExchangeRate(from_currency || '', to_currency || '');
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_from_amount) {
                    this.setConverterToAmount(Number(amount));
                } else {
                    this.setConverterToAmount(0);
                }
                this.validateToAmount();
                this.setConverterToError('');
                this.setIsTimerVisible(true);
                account_transfer.setAccountTransferAmount(target.value);
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    async onChangeConverterToAmount(
        { target }: { target: { value: number } },
        from_currency: string,
        to_currency: string
    ): Promise<void> {
        const { account_transfer, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterToAmount(target.value);
            this.validateToAmount();
            if (this.converter_to_error) {
                this.setConverterFromAmount(0);
                this.setConverterFromError('');
                this.setIsTimerVisible(false);
                account_transfer.setAccountTransferAmount(0);
            } else {
                const rate = await this.getExchangeRate(from_currency, to_currency);
                const decimals = getDecimalPlaces(to_currency);
                const amount = (rate * target.value).toFixed(decimals);
                if (+amount || this.converter_to_amount) {
                    this.setConverterFromAmount(Number(amount));
                } else {
                    this.setConverterFromAmount(0);
                }
                general_store.percentageSelectorSelectionStatus(true);
                general_store.calculatePercentage();
                this.validateFromAmount();
                if (this.converter_from_error) {
                    this.setIsTimerVisible(false);
                    account_transfer.setAccountTransferAmount(0);
                } else {
                    this.setConverterFromError('');
                    this.setIsTimerVisible(true);
                    account_transfer.setAccountTransferAmount(Number(amount));
                }
            }
        } else {
            this.resetConverter();
        }
    }

    @action.bound
    resetConverter() {
        this.setConverterFromAmount(0);
        this.setConverterToAmount(0);
        this.setConverterFromError('');
        this.setConverterToError('');
        this.setIsTimerVisible(false);
        this.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus(true);
    }
}

import { action, observable, makeObservable } from 'mobx';
import { getDecimalPlaces } from '@deriv/shared';
import { TRootStore } from '../types';

export default class CryptoFiatConverterStore {
    constructor(public root_store: TRootStore) {
        makeObservable(this, {
            converter_from_amount: observable,
            converter_to_amount: observable,
            converter_from_error: observable,
            converter_to_error: observable,
            is_timer_visible: observable,
            setConverterFromAmount: action.bound,
            setConverterToAmount: action.bound,
            setConverterFromError: action.bound,
            setConverterToError: action.bound,
            setIsTimerVisible: action.bound,
            resetTimer: action.bound,
            validateFromAmount: action.bound,
            validateToAmount: action.bound,
            onChangeConverterFromAmount: action.bound,
            onChangeConverterToAmount: action.bound,
            resetConverter: action.bound,
        });
    }

    converter_from_amount = '';
    converter_to_amount = '';
    converter_from_error: string | JSX.Element = '';
    converter_to_error = '';
    is_timer_visible = false;

    setConverterFromAmount(amount: string): void {
        this.converter_from_amount = amount;
    }

    setConverterToAmount(amount: string): void {
        this.converter_to_amount = amount;
    }

    setConverterFromError(error: string | JSX.Element): void {
        this.converter_from_error = error;
    }

    setConverterToError(error: string): void {
        this.converter_to_error = error;
    }

    setIsTimerVisible(is_timer_visible: boolean): void {
        this.is_timer_visible = is_timer_visible;
    }

    resetTimer(): void {
        this.setIsTimerVisible(false);
    }

    validateFromAmount() {
        const { account_transfer, general_store, withdraw } = this.root_store.modules.cashier;

        if (general_store.active_container === 'account_transfer') {
            account_transfer.validateTransferFromAmount();
        } else {
            withdraw.validateWithdrawFromAmount();
        }
    }

    validateToAmount() {
        const { account_transfer, general_store, withdraw } = this.root_store.modules.cashier;

        if (general_store.active_container === 'account_transfer') {
            account_transfer.validateTransferToAmount();
        } else {
            withdraw.validateWithdrawToAmount();
        }
    }

    async onChangeConverterFromAmount(
        { target }: { target: { value: string } },
        from_currency?: string,
        to_currency?: string,
        converted_amount?: number
    ): Promise<void> {
        const { account_transfer, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterFromAmount(target.value);
            this.validateFromAmount();
            general_store.percentageSelectorSelectionStatus(true);
            general_store.calculatePercentage();
            if (this.converter_from_error) {
                this.setConverterToAmount('');
                this.setConverterToError('');
                this.setIsTimerVisible(false);
                account_transfer.setAccountTransferAmount('');
            } else {
                const decimals = getDecimalPlaces(to_currency || '');
                const amount = converted_amount?.toFixed(decimals) || '1';
                if (+amount || this.converter_from_amount) {
                    this.setConverterToAmount(amount);
                } else {
                    this.setConverterToAmount('');
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

    async onChangeConverterToAmount(
        { target }: { target: { value: string } },
        to_currency: string,
        from_currency: string,
        converted_amount?: number
    ): Promise<void> {
        const { account_transfer, general_store } = this.root_store.modules.cashier;

        this.resetTimer();
        if (target.value) {
            this.setConverterToAmount(target.value);
            this.validateToAmount();
            if (this.converter_to_error) {
                this.setConverterFromAmount('');
                this.setConverterFromError('');
                this.setIsTimerVisible(false);
                account_transfer.setAccountTransferAmount('');
            } else {
                const decimals = getDecimalPlaces(from_currency);
                const amount = converted_amount?.toFixed(decimals) || '1';
                if (+amount || this.converter_to_amount) {
                    this.setConverterFromAmount(amount);
                } else {
                    this.setConverterFromAmount('');
                }
                general_store.percentageSelectorSelectionStatus(true);
                general_store.calculatePercentage();
                this.validateFromAmount();
                if (this.converter_from_error) {
                    this.setIsTimerVisible(false);
                    account_transfer.setAccountTransferAmount('');
                } else {
                    this.setConverterFromError('');
                    this.setIsTimerVisible(true);
                    account_transfer.setAccountTransferAmount(amount);
                }
            }
        } else {
            this.resetConverter();
        }
    }

    resetConverter() {
        this.setConverterFromAmount('');
        this.setConverterToAmount('');
        this.setConverterFromError('');
        this.setConverterToError('');
        this.setIsTimerVisible(false);
        this.root_store.modules.cashier?.general_store.percentageSelectorSelectionStatus(true);
    }
}

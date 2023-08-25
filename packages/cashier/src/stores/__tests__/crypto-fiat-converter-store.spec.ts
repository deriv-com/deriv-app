import { TRootStore } from '../../types';
import { mockStore } from '@deriv/stores';
import CryptoFiatConverterStore from '../crypto-fiat-converter-store';

let crypto_fiat_converter_store: CryptoFiatConverterStore, root_store: ReturnType<typeof mockStore>;

beforeEach(() => {
    root_store = mockStore({
        modules: {
            cashier: {
                account_transfer: {
                    container: 'account_transfer',
                    setAccountTransferAmount: jest.fn(),
                    validateTransferFromAmount: jest.fn(),
                    validateTransferToAmount: jest.fn(),
                },
                general_store: {
                    active_container: 'deposit',
                    calculatePercentage: jest.fn(),
                    percentageSelectorSelectionStatus: jest.fn(),
                },
                withdraw: {
                    validateWithdrawFromAmount: jest.fn(),
                    validateWithdrawToAmount: jest.fn(),
                },
            },
        },
        exchange_rates: {
            data: {
                rates: {
                    USD: 1,
                    AED: 3.67,
                },
            },
        },
    });
    crypto_fiat_converter_store = new CryptoFiatConverterStore(root_store as TRootStore);
});

describe('CryptoFiatConverterStore', () => {
    it('should set converter_from_amount to the given amount', () => {
        crypto_fiat_converter_store.setConverterFromAmount('100');

        expect(crypto_fiat_converter_store.converter_from_amount).toBe('100');
    });

    it('should set converter_to_amount to the given amount', () => {
        crypto_fiat_converter_store.setConverterToAmount('100');

        expect(crypto_fiat_converter_store.converter_to_amount).toBe('100');
    });

    it('should set error to converter_from_error', () => {
        crypto_fiat_converter_store.setConverterFromError('Something went wrong');

        expect(crypto_fiat_converter_store.converter_from_error).toEqual('Something went wrong');
    });

    it('should set error to converter_to_error', () => {
        crypto_fiat_converter_store.setConverterToError('Something went wrong');

        expect(crypto_fiat_converter_store.converter_to_error).toEqual('Something went wrong');
    });

    it('should set is_timer_visible to a truthy value', () => {
        crypto_fiat_converter_store.setIsTimerVisible(true);

        expect(crypto_fiat_converter_store.is_timer_visible).toBeTruthy();
    });

    it('should set is_timer_visible to a false value', () => {
        crypto_fiat_converter_store.resetTimer();

        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
    });

    it('should call function validateWithdrawFromAmount when account transfer container and general store container are different', () => {
        crypto_fiat_converter_store.validateFromAmount();

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.withdraw.validateWithdrawFromAmount
        ).toBeCalledTimes(1);
    });

    it('should call function validateTransferFromAmount when account transfer container and general store container are different', () => {
        crypto_fiat_converter_store.root_store.modules.cashier.general_store.active_container = 'account_transfer';
        crypto_fiat_converter_store.validateFromAmount();

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.validateTransferFromAmount
        ).toBeCalledTimes(1);
    });

    it('should call function validateWithdrawToAmount when account transfer container and general store container are different', () => {
        crypto_fiat_converter_store.validateToAmount();

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.withdraw.validateWithdrawToAmount
        ).toBeCalledTimes(1);
    });

    it('should call function validateTransferToAmount when account transfer container and general store container are different', () => {
        crypto_fiat_converter_store.root_store.modules.cashier.general_store.active_container = 'account_transfer';
        crypto_fiat_converter_store.validateToAmount();

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.validateTransferToAmount
        ).toBeCalledTimes(1);
    });

    it('should reset converter details when onChangeConverterFromAmount is called without passing target value', async () => {
        await crypto_fiat_converter_store.onChangeConverterFromAmount({ target: { value: '' } }, 'USD', 'AED');

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus
        ).toBeCalledTimes(1);
        expect(crypto_fiat_converter_store.converter_from_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_to_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_from_error).toEqual('');
        expect(crypto_fiat_converter_store.converter_to_error).toEqual('');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
    });

    it('should set converter_from_amount with an amount when target value is passed', async () => {
        await crypto_fiat_converter_store.onChangeConverterFromAmount({ target: { value: '3' } }, 'USD', 'AED');

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus
        ).toBeCalledTimes(1);
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.general_store.calculatePercentage
        ).toBeCalledTimes(1);
        expect(crypto_fiat_converter_store.converter_from_amount).toEqual('3');
    });

    it('should clear converter_to_amount, converter_to_error, is_timer_visible and setAccountTransferAmount when converter_from_error has error', async () => {
        crypto_fiat_converter_store.setConverterFromError('Something went wrong');
        await crypto_fiat_converter_store.onChangeConverterFromAmount({ target: { value: '3' } }, 'USD', 'AED');

        expect(crypto_fiat_converter_store.converter_to_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_to_error).toEqual('');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.setAccountTransferAmount
        ).toHaveBeenCalledWith('');
    });

    it('should set converter_to_amount with an amount when onChangeConverterFromAmount is called', async () => {
        await crypto_fiat_converter_store.onChangeConverterFromAmount({ target: { value: '3' } }, 'USD', 'AED', 11.01);

        expect(crypto_fiat_converter_store.converter_to_amount).toEqual('11.01');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeTruthy();
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.setAccountTransferAmount
        ).toHaveBeenCalledWith('3');
    });

    it('should reset converter details when onChangeConverterToAmount is called without passing target value', async () => {
        await crypto_fiat_converter_store.onChangeConverterToAmount({ target: { value: '' } }, 'USD', 'AED', 11.01);

        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.general_store.percentageSelectorSelectionStatus
        ).toBeCalledTimes(1);
        expect(crypto_fiat_converter_store.converter_from_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_to_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_from_error).toEqual('');
        expect(crypto_fiat_converter_store.converter_to_error).toEqual('');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
    });

    it('should set converter_to_amount with an amount when target value is passed', async () => {
        await crypto_fiat_converter_store.onChangeConverterToAmount({ target: { value: '3' } }, 'USD', 'AED', 11.01);

        expect(crypto_fiat_converter_store.converter_to_amount).toEqual('3');
    });

    it('should clear converter_from_amount, converter_from_error, is_timer_visible and setAccountTransferAmount when converter_to_error has error', async () => {
        crypto_fiat_converter_store.setConverterToError('Something went wrong');
        await crypto_fiat_converter_store.onChangeConverterToAmount({ target: { value: '3' } }, 'USD', 'AED', 11.01);

        expect(crypto_fiat_converter_store.converter_from_amount).toEqual('');
        expect(crypto_fiat_converter_store.converter_from_error).toEqual('');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.setAccountTransferAmount
        ).toHaveBeenCalledWith('');
    });

    it('should set converter_from_amount with an amount when onChangeConverterToAmount is called', async () => {
        await crypto_fiat_converter_store.onChangeConverterToAmount({ target: { value: '3' } }, 'USD', 'AED', 11.01);

        expect(crypto_fiat_converter_store.converter_from_amount).toEqual('11.01');
        expect(crypto_fiat_converter_store.is_timer_visible).toBeTruthy();
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.setAccountTransferAmount
        ).toHaveBeenCalledWith('11.01');
    });

    it('should set is_timer_visible to false when converter_from_error has error', async () => {
        crypto_fiat_converter_store.setConverterFromError('Something went wrong');
        await crypto_fiat_converter_store.onChangeConverterToAmount({ target: { value: '3' } }, 'USD', 'AED', 11.01);

        expect(crypto_fiat_converter_store.is_timer_visible).toBeFalsy();
        expect(
            crypto_fiat_converter_store.root_store.modules.cashier.account_transfer.setAccountTransferAmount
        ).toHaveBeenCalledWith('');
    });
});

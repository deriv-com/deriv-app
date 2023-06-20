import { isMobile, validNumber } from '@deriv/shared';
import WithdrawStore from '../withdraw-store';
import { configure } from 'mobx';
import { TWebSocket, TRootStore } from '../../types';
import { mockStore } from '@deriv/stores';

configure({ safeDescriptors: false });

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getMinWithdrawal: jest.fn(() => 100),
    isMobile: jest.fn(() => false),
    validNumber: jest.fn(() => {
        return { is_ok: true };
    }),
}));

describe('WithdrawStore', () => {
    let withdraw_store: WithdrawStore, root_store: TRootStore, WS: DeepPartial<TWebSocket>;

    beforeEach(() => {
        root_store = mockStore({
            client: {
                account_list: [
                    {
                        loginid: 'CR9000000',
                        icon: 'icon',
                    },
                ],
                account_status: {
                    authentication: { needs_verification: ['identity'] },
                    status: [],
                },
                balance: '1000',
                currency: 'USD',
                is_logged_in: true,
                is_virtual: false,
                is_withdrawal_lock: false,
                getLimits: () => {
                    return {
                        get_limits: {
                            remainder: 80,
                        },
                    };
                },
                loginid: 'CR9000000',
                setVerificationCode: jest.fn(),
            },
            modules: {
                cashier: {
                    general_store: {
                        active_container: 'withdraw',
                        is_crypto: false,
                        percentageSelectorSelectionStatus: jest.fn(),
                        onMountCommon: jest.fn(),
                        setLoading: jest.fn(),
                        setOnRemount: jest.fn(),
                    },
                    crypto_fiat_converter: {
                        converter_from_amount: '100',
                        converter_to_amount: '100',
                        onChangeConverterFromAmount: jest.fn(),
                        resetConverter: jest.fn(),
                        setConverterFromAmount: jest.fn(),
                        setConverterFromError: jest.fn(),
                        setConverterToAmount: jest.fn(),
                        setConverterToError: jest.fn(),
                        setIsTimerVisible: jest.fn(),
                    },
                    error_dialog: {
                        openReadMoreDialog: jest.fn(),
                        setErrorMessage: jest.fn(),
                    },
                    iframe: {
                        checkIframeLoaded: jest.fn(),
                        clearTimeoutCashierUrl: jest.fn(),
                        setSessionTimeout: jest.fn(),
                        clearIframe: jest.fn(),
                        is_session_timeout: false,
                        setContainerHeight: jest.fn(),
                        setIframeUrl: jest.fn(),
                        setTimeoutCashierUrl: jest.fn(),
                    },
                },
            },
        }) as TRootStore;
        WS = {
            authorized: {
                cashier: jest.fn(() => Promise.resolve({ cashier: 'https://deriv.com' })),
            },
            cryptoConfig: () => Promise.resolve(),
            cryptoWithdraw: jest.fn(() => Promise.resolve({})),
        };

        withdraw_store = new WithdrawStore(WS as TWebSocket, root_store);
    });

    it('should set is_withdraw_confirmed', () => {
        withdraw_store.setIsWithdrawConfirmed(true);
        expect(withdraw_store.is_withdraw_confirmed).toBeTruthy();
        expect(withdraw_store.withdraw_amount).toBe('100');
    });

    it('should set withdraw_amount', () => {
        withdraw_store.setWithdrawAmount('200');
        expect(withdraw_store.withdraw_amount).toBe('200');
    });

    it('should request for withdrawal', async () => {
        const { setConverterFromError } = withdraw_store.root_store.modules.cashier.crypto_fiat_converter;
        const spySetErrorMessage = jest.spyOn(withdraw_store.error, 'setErrorMessage');
        const spySaveWithdraw = jest.spyOn(withdraw_store, 'saveWithdraw');
        const error_code = 'CryptoWithdrawalError';
        const error_message = 'Sorry, an error occurred.';
        const verification_code = 'aBcDefXa';

        withdraw_store.root_store.client.is_logged_in = false;
        await withdraw_store.requestWithdraw(verification_code);
        expect(spySaveWithdraw).not.toHaveBeenCalledWith(verification_code);

        withdraw_store.root_store.client.is_logged_in = true;
        withdraw_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = '';
        await withdraw_store.requestWithdraw(verification_code);
        expect(setConverterFromError).toHaveBeenCalledWith('This field is required.');

        withdraw_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = '100';
        await withdraw_store.requestWithdraw(verification_code);
        expect(spySaveWithdraw).toHaveBeenCalledWith(verification_code);

        (withdraw_store.WS.cryptoWithdraw as jest.Mock).mockResolvedValueOnce({
            error: { code: error_code, message: error_message },
        });
        await withdraw_store.requestWithdraw(verification_code);
        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: error_code, message: error_message });
    });

    it('should save withdrawal request', async () => {
        const { setConverterFromAmount, setConverterToAmount } =
            withdraw_store.root_store.modules.cashier.crypto_fiat_converter;
        const spySetErrorMessage = jest.spyOn(withdraw_store.error, 'setErrorMessage');
        const error_message = 'Sorry, an error occurred.';
        const verification_code = 'aBcDefXa';

        await withdraw_store.saveWithdraw(verification_code);
        expect(spySetErrorMessage).toHaveBeenCalledWith({ code: '', message: '' });
        expect(withdraw_store.is_withdraw_confirmed).toBeTruthy();
        expect(withdraw_store.withdraw_amount).toBe('100');

        (withdraw_store.WS.cryptoWithdraw as jest.Mock).mockResolvedValueOnce({ error: { message: error_message } });
        await withdraw_store.saveWithdraw(verification_code);
        expect(spySetErrorMessage).toHaveBeenCalled();
        expect(setConverterFromAmount).toHaveBeenCalledWith('');
        expect(setConverterToAmount).toHaveBeenCalledWith('');
        expect(withdraw_store.blockchain_address).toBe('');
    });

    it('should reset withdrawal form', () => {
        const { setConverterFromAmount, setConverterToAmount } =
            withdraw_store.root_store.modules.cashier.crypto_fiat_converter;

        withdraw_store.resetWithdrawForm();
        expect(setConverterFromAmount).toHaveBeenCalledWith('');
        expect(setConverterToAmount).toHaveBeenCalledWith('');
        expect(withdraw_store.blockchain_address).toBe('');
        expect(withdraw_store.blockchain_address).toBe('');
    });

    it('should set blockchain_address', () => {
        const blockchain_address = 'tb1ql7w62elx9ucw4pj5lgw4l028hmuw80sndtntxt';

        withdraw_store.setBlockchainAddress(blockchain_address);
        expect(withdraw_store.blockchain_address).toBe(blockchain_address);
    });

    it('should set the iframe url if verification code is valid', async () => {
        const { checkIframeLoaded, setIframeUrl } = withdraw_store.root_store.modules.cashier.iframe;

        await withdraw_store.onMountWithdraw();
        expect(checkIframeLoaded).toHaveBeenCalled();

        withdraw_store.root_store.modules.cashier.iframe.is_session_timeout = true;
        await withdraw_store.onMountWithdraw('aBcDefXa');
        expect(checkIframeLoaded).toHaveBeenCalled();
        expect(setIframeUrl).toHaveBeenCalledWith('https://deriv.com');
    });

    it('should handle error on mount of withdraw', async () => {
        const { setSessionTimeout, clearTimeoutCashierUrl } = withdraw_store.root_store.modules.cashier.iframe;
        const spyHandleCashierError = jest.spyOn(withdraw_store.error, 'handleCashierError');
        const error = { code: 'InvalidToken', message: 'Your token has expired or is invalid.' };

        withdraw_store.root_store.modules.cashier.iframe.is_session_timeout = true;
        (withdraw_store.WS.authorized.cashier as jest.Mock).mockResolvedValueOnce({ error });
        await withdraw_store.onMountWithdraw('aBcDefXa');
        expect(spyHandleCashierError).toHaveBeenCalledWith(error);
        expect(setSessionTimeout).toHaveBeenCalledWith(true);
        expect(clearTimeoutCashierUrl).toHaveBeenCalled();
    });

    it('should not set the iframe url if the client is using a crypto or virtual account', async () => {
        const { setIframeUrl } = withdraw_store.root_store.modules.cashier.iframe;
        const verification_code = 'aBcDefXa';

        withdraw_store.root_store.modules.cashier.iframe.is_session_timeout = true;
        await withdraw_store.onMountWithdraw(verification_code);
        expect(setIframeUrl).toHaveBeenCalledWith('');

        withdraw_store.root_store.client.is_virtual = true;
        await withdraw_store.onMountWithdraw(verification_code);
        expect(setIframeUrl).toHaveBeenCalledWith('');
    });

    it('should return an error on mount of crypto withdraw if verification code is not valid', async () => {
        const { setLoading } = withdraw_store.root_store.modules.cashier.general_store;
        const { setSessionTimeout, clearTimeoutCashierUrl } = withdraw_store.root_store.modules.cashier.iframe;
        const spyHandleCashierError = jest.spyOn(withdraw_store.error, 'handleCashierError');

        await withdraw_store.onMountCryptoWithdraw('abc');
        expect(spyHandleCashierError).toHaveBeenCalledWith({
            code: 'InvalidToken',
            message: 'Your token has expired or is invalid.',
        });
        expect(setLoading).toHaveBeenCalledWith(false);
        expect(setSessionTimeout).toHaveBeenCalledWith(true);
        expect(clearTimeoutCashierUrl).toHaveBeenCalled();
    });

    it('should mount crypto withdraw if verification code is valid', async () => {
        const { setLoading } = withdraw_store.root_store.modules.cashier.general_store;
        const spyHandleCashierError = jest.spyOn(withdraw_store.error, 'handleCashierError');

        await withdraw_store.onMountCryptoWithdraw('aBcDefXa');
        expect(spyHandleCashierError).not.toHaveBeenCalled();
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('should return is_withdrawal_locked equal to false if there is no account status', () => {
        withdraw_store.root_store.client.account_status = {
            currency_config: {},
            prompt_client_to_authenticate: 0,
            risk_classification: '',
            status: [],
            p2p_status: 'none',
        };
        expect(withdraw_store.is_withdrawal_locked).toBeFalsy();
    });

    it('should return is_withdrawal_locked equal to true if client needs POI verification', () => {
        withdraw_store.root_store.client.account_status.status = ['authentication_needed'];
        withdraw_store.error.is_ask_authentication = true;
        expect(withdraw_store.is_withdrawal_locked).toBeTruthy();
    });

    it('should return is_withdrawal_locked equal to true if client needs financial risk approval', () => {
        withdraw_store.error.is_ask_financial_risk_approval = true;
        expect(withdraw_store.is_withdrawal_locked).toBeTruthy();
    });

    it('should set max_withdraw_amount', () => {
        withdraw_store.setMaxWithdrawAmount(100);
        expect(withdraw_store.max_withdraw_amount).toBe(100);
    });

    it('should check 10k limit', async () => {
        await withdraw_store.check10kLimit();
        expect(withdraw_store.max_withdraw_amount).toBe(80);
        expect(withdraw_store.is_10k_withdrawal_limit_reached).toBeTruthy();
    });

    it('should set is_10k_withdrawal_limit_reached', () => {
        withdraw_store.set10kLimitation(true);
        expect(withdraw_store.is_10k_withdrawal_limit_reached).toBeTruthy();
    });

    it('should set crypto_config', () => {
        withdraw_store.setCryptoConfig();
        expect(withdraw_store.crypto_config).toBeTruthy();
    });

    it('should set percentage selector result', () => {
        const { resetConverter, setConverterFromAmount, setIsTimerVisible } =
            withdraw_store.root_store.modules.cashier.crypto_fiat_converter;
        const { percentageSelectorSelectionStatus } = withdraw_store.root_store.modules.cashier.general_store;
        const spyValidateWithdrawFromAmount = jest.spyOn(withdraw_store, 'validateWithdrawFromAmount');

        withdraw_store.setWithdrawPercentageSelectorResult('100', 1000);
        expect(setConverterFromAmount).toHaveBeenCalledWith('100');
        expect(spyValidateWithdrawFromAmount).toHaveBeenCalled();

        withdraw_store.setWithdrawPercentageSelectorResult('0', 0);
        expect(resetConverter).toHaveBeenCalled();
        expect(setIsTimerVisible).toHaveBeenCalledWith(false);
        expect(percentageSelectorSelectionStatus).toHaveBeenCalledWith(false);
    });

    it('should return an error if balance is less than the provided converter from amount', () => {
        const { setConverterFromError } = withdraw_store.root_store.modules.cashier.crypto_fiat_converter;

        withdraw_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = '10000';
        withdraw_store.validateWithdrawFromAmount();
        expect(setConverterFromError).toHaveBeenCalledWith('Insufficient funds');
    });

    it('should return an error if balance is less than the minimum withdrawal amount', () => {
        const { setConverterFromError } = withdraw_store.root_store.modules.cashier.crypto_fiat_converter;

        withdraw_store.crypto_config = { currencies_config: { USD: { minimum_withdrawal: 2000 } } };
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        withdraw_store.validateWithdrawFromAmount();
        expect(setConverterFromError).toHaveBeenCalled();

        (isMobile as jest.Mock).mockReturnValueOnce(false);
        withdraw_store.validateWithdrawFromAmount();
        expect(setConverterFromError).toHaveBeenCalledWith(
            'Your balance (1,000.00 USD) is less than the current minimum withdrawal allowed (2,000.00 USD). Please top up your account to continue with your withdrawal.'
        );
    });

    it('should return an error if converter from/to amount is not a valid number', () => {
        const { setConverterFromError, setConverterToError } =
            withdraw_store.root_store.modules.cashier.crypto_fiat_converter;
        const error_message = 'Should be a valid number.';

        (validNumber as jest.Mock).mockReturnValue({ is_ok: false, message: error_message });
        withdraw_store.validateWithdrawFromAmount();
        expect(setConverterFromError).toHaveBeenCalledWith(error_message);

        withdraw_store.validateWithdrawToAmount();
        expect(setConverterToError).toHaveBeenCalledWith(error_message);
    });

    it('should get account_platform_icon', () => {
        expect(withdraw_store.account_platform_icon).toBe('icon');
    });
});

import React from 'react';
import { useCurrencyConfig } from '@deriv/api';
import { useTransferBetweenAccounts } from '@deriv/hooks';
import { validNumber } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

type TUseWalletTransferValidationParams = {
    from_account: ReturnType<typeof useTransferBetweenAccounts>['active_wallet'];
    to_account: ReturnType<typeof useTransferBetweenAccounts>['active_wallet'];
};

const INITIAL_DEMO_BALANCE = 10000.0;

const ERROR_CODES = {
    is_demo: {
        between_min_max: 'BetweenMinMax',
        insufficient_fund: 'InsufficientFund',
    },
};

const useWalletTransferValidation = ({ from_account, to_account }: TUseWalletTransferValidationParams) => {
    const { traders_hub } = useStore();
    const { setWalletModalActiveTab } = traders_hub;
    const { active_wallet } = useTransferBetweenAccounts();
    const { getConfig } = useCurrencyConfig();

    const validateAmount = (amount: number) => {
        const errors = [];

        if (!amount || !to_account) return;

        if (!active_wallet?.is_demo && from_account) {
            //TODO: remove real wallet validation after QA testing
            if (amount > from_account?.balance) {
                errors.push({
                    variant: 'base',
                    key: 'Insufficient balance',
                    message: "Oops, seems like you don't have enough funds",
                    type: 'error',
                });
            }
        } else {
            const { is_ok, message } = validNumber(amount.toString(), {
                type: 'float',
                decimals: getConfig(from_account?.currency ?? '')?.fractional_digits,
                min: 1,
                max: from_account?.balance,
            });

            const should_reset_balance =
                active_wallet?.balance !== undefined &&
                amount > active_wallet?.balance &&
                active_wallet?.balance < INITIAL_DEMO_BALANCE;

            if (from_account?.loginid === active_wallet?.loginid && should_reset_balance) {
                errors.push({
                    variant: 'with-action-button',
                    key: ERROR_CODES.is_demo.insufficient_fund,
                    button_label: <Localize i18n_default_text='Reset balance' />,
                    onClickHandler: () => setWalletModalActiveTab('Deposit'),
                    message: (
                        <Localize i18n_default_text='You have insufficient fund in the selected wallet, please reset your virtual balance' />
                    ),
                    type: 'error',
                });
            } else if (!is_ok) {
                errors.push({
                    variant: 'base',
                    key: ERROR_CODES.is_demo.between_min_max,
                    message: `${message} ${from_account?.display_currency_code}`,
                    type: 'error',
                });
            }
        }

        return errors;
    };

    return {
        validator: validateAmount,
    };
};

export default useWalletTransferValidation;

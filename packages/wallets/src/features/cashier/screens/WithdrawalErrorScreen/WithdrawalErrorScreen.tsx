import React, { ComponentProps, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { getInitialLanguage, Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletsErrorScreen } from '../../../../components';
import { CryptoWithdrawalErrorCodes } from '../../../../constants/errorCodes';

type TProps = {
    error: TSocketError<'cashier'>['error'];
    resetError?: VoidFunction;
    setResendEmail?: React.Dispatch<React.SetStateAction<boolean>>;
};

type TErrorContent = {
    buttonText?: React.ReactNode;
    buttonVariant?: ComponentProps<typeof Button>['variant'];
    message: React.ReactNode;
    onClick?: () => void;
    title: React.ReactNode;
};

type TErrorCodeHandlers = Record<string, TErrorContent>;

const WithdrawalErrorScreen: React.FC<TProps> = ({ error, resetError, setResendEmail }) => {
    const history = useHistory();
    const { data } = useActiveWalletAccount();
    const { currentLang, localize } = useTranslations();
    const i18nLanguage = getInitialLanguage();
    const currency = data?.currency;

    useEffect(() => {
        // reload when language is switched to show error message for latest WS connection
        if (currentLang !== i18nLanguage) {
            window.location.reload();
        }
    }, [currentLang, i18nLanguage]);

    const defaultContent: TErrorContent = {
        buttonText: <Localize i18n_default_text='Try again' />,
        buttonVariant: 'ghost',
        message: error.message,
        onClick: () => window.location.reload(),
        title: <Localize i18n_default_text='Oops, something went wrong!' />,
    };

    const withdrawalErrorCodeHandlers: TErrorCodeHandlers = {
        [CryptoWithdrawalErrorCodes.InvalidToken]: {
            ...defaultContent,
            buttonText: <Localize i18n_default_text='Resend email' />,
            buttonVariant: 'contained',
            message: localize('The verification link you used is invalid or expired. Please request for a new one.'),
            onClick: () => {
                resetError?.();
                setResendEmail?.(true);
            },
            title: <Localize i18n_default_text='Email verification failed' />,
        },
        [CryptoWithdrawalErrorCodes.CryptoInvalidAddress]: {
            ...defaultContent,
            onClick: resetError,
            title: <Localize i18n_default_text='Error' />,
        },
        [CryptoWithdrawalErrorCodes.CryptoLimitAgeVerified]: {
            ...defaultContent,
            buttonText: <Localize i18n_default_text='Verify identity' />,
            buttonVariant: 'contained',
            onClick: () => {
                // @ts-expect-error the following link is not part of wallets routes config
                history.push('/account/proof-of-identity');
            },
            title: <Localize i18n_default_text='Error' />,
        },
        [CryptoWithdrawalErrorCodes.SuspendedCurrency]: {
            ...defaultContent,
            buttonText: undefined,
            message: localize(
                'Due to system maintenance, withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.',
                { currency }
            ),
            title: (
                <Localize
                    i18n_default_text='{{currency}} Wallet withdrawals are temporarily unavailable'
                    values={{ currency }}
                />
            ),
        },
        [CryptoWithdrawalErrorCodes.SuspendedWithdrawal]: {
            ...defaultContent,
            buttonText: undefined,
            message: localize(
                'Due to system maintenance, withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.',
                { currency }
            ),
            title: (
                <Localize
                    i18n_default_text='{{currency}} Wallet withdrawals are temporarily unavailable'
                    values={{ currency }}
                />
            ),
        },
        [CryptoWithdrawalErrorCodes.CryptoConnectionError]: {
            ...defaultContent,
            buttonText: undefined,
            title: <Localize i18n_default_text='Maintenance in progress' />,
        },
    };

    const content = withdrawalErrorCodeHandlers[error.code] || defaultContent;

    return <WalletsErrorScreen {...content} />;
};

export default WithdrawalErrorScreen;

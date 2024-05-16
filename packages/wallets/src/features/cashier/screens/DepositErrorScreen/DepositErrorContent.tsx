import { TSocketError } from '@deriv/api-v2/types';

type TDepositErrorContentProps = {
    cryptoConnectionError: boolean;
    currency?: string;
    error: TSocketError<'cashier'>['error'];
    suspendedCurrencyDeposit: boolean;
};

const getDepositErrorContent = ({
    cryptoConnectionError,
    currency,
    error,
    suspendedCurrencyDeposit,
}: TDepositErrorContentProps) => {
    let content: { buttonText?: string; message?: string; title?: string } = {
        buttonText: 'Try again',
        message: error.message,
        title: undefined,
    };

    if (suspendedCurrencyDeposit) {
        content = {
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        };
    }
    if (cryptoConnectionError) {
        content = { ...content, buttonText: undefined, title: 'Maintenance in progess' };
    }
    return content;
};

export default getDepositErrorContent;

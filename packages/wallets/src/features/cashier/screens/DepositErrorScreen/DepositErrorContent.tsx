import { TSocketError } from '@deriv/api-v2/types';
import { CryptoDepositErrorCodes } from '../../../../constants/errorCodes';

type TDepositErrorContentProps = {
    currency?: string;
    error: TSocketError<'cashier'>['error'];
};

const getDepositErrorContent = ({ currency, error }: TDepositErrorContentProps) => {
    const cryptoConnectionError = error.code === CryptoDepositErrorCodes.CryptoConnectionError;
    const suspendedCurrencyDeposit =
        error.code === CryptoDepositErrorCodes.SuspendedCurrency ||
        error.code === CryptoDepositErrorCodes.SuspendedDeposit;

    let content: { buttonText?: string; message?: string; onClick?: () => void; showIcon?: boolean; title?: string } = {
        buttonText: 'Try again',
        message: error.message,
        onClick: () => window.location.reload(),
        showIcon: true,
        title: undefined,
    };

    if (suspendedCurrencyDeposit) {
        content = {
            ...content,
            buttonText: undefined,
            message: `Due to system maintenance, deposits with your ${currency} Wallet are unavailable at the moment. Please try again later.`,
            showIcon: false,
            title: `${currency} Wallet deposits are temporarily unavailable`,
        };
    }
    if (cryptoConnectionError) {
        content = { ...content, buttonText: undefined, title: 'Maintenance in progess' };
    }
    return content;
};

export default getDepositErrorContent;

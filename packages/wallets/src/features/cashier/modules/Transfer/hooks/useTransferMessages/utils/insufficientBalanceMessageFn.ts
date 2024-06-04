import { TMessageFnProps } from '../../../types';

const insufficientBalanceMessageFn = ({ sourceAccount, sourceAmount }: TMessageFnProps) => {
    if (!sourceAccount.accountName || isNaN(Number(sourceAccount.balance))) return null;

    const sourceAccountBalance = Number(sourceAccount.balance);

    if (sourceAccountBalance === 0 || sourceAccountBalance < sourceAmount) {
        const message = {
            text: 'Your {{sourceAccountName}} has insufficient balance.',
            values: { sourceAccountName: sourceAccount.accountName },
        };
        return {
            message,
            type: 'error' as const,
        };
    }

    return null;
};

export default insufficientBalanceMessageFn;

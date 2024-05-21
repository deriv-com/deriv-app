import { TMessageFnProps, TTransferMessage } from '../../../types';

let text: TTransferMessage['message']['text'],
    type: TTransferMessage['type'],
    values: TTransferMessage['message']['values'];

const countLimitMessageFn = ({ limits, sourceAccount, targetAccount }: TMessageFnProps) => {
    if (!targetAccount) return null;

    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'internal';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    //@ts-expect-error needs backend type
    const allowedCount = limits?.daily_transfers?.[platformKey]?.allowed as number;

    //@ts-expect-error needs backend type
    const availableCount = limits?.daily_transfers?.[platformKey]?.available as number;

    if (allowedCount === undefined || availableCount === undefined) return null;

    if (availableCount === 0) {
        text = isTransferBetweenWallets
            ? 'You have reached your daily transfer limit of {{allowedCount}} transfers between your Wallets. The limit will reset at 00:00 GMT.'
            : 'You have reached your daily transfer limit of {{allowedCount}} between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.';
        values = {
            allowedCount,
            sourceAccountName: sourceAccount.accountName,
            targetAccountName: targetAccount.accountName,
        };
        type = 'error' as const;

        return {
            message: { text, values },
            type,
        };
    }

    return null;
};

export default countLimitMessageFn;

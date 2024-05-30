import { TMessageFnProps, TTransferMessage } from '../../../types';

let text: TTransferMessage['message']['text'],
    type: TTransferMessage['type'],
    values: TTransferMessage['message']['values'];

const countLimitMessageFn = ({ activeWallet, limits, sourceAccount, targetAccount }: TMessageFnProps) => {
    if (!targetAccount) return null;

    const isTransferBetweenWallets =
        sourceAccount.account_category === 'wallet' && targetAccount.account_category === 'wallet';

    const isDemoTransfer = activeWallet?.is_virtual;

    const keyAccountType =
        [sourceAccount, targetAccount].find(acc => acc.account_category !== 'wallet')?.account_type ?? 'internal';

    const platformKey = keyAccountType === 'standard' ? 'dtrade' : keyAccountType;

    const allowedCount = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_transfers?.virtual?.allowed as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_transfers?.[platformKey]?.allowed as number);

    const availableCount = isDemoTransfer
        ? //@ts-expect-error needs backend type
          (limits?.daily_transfers?.virtual?.available as number)
        : //@ts-expect-error needs backend type
          (limits?.daily_transfers?.[platformKey]?.available as number);

    if (allowedCount === undefined || availableCount === undefined) return null;

    if (availableCount === 0 && isDemoTransfer) {
        text =
            'You have reached your daily transfer limit of {{allowedCount}} transfers for your virtual funds. The limit will reset at 00:00 GMT.';
        values = {
            allowedCount,
        };
        type = 'error' as const;

        return {
            message: { text, values },
            type,
        };
    }

    if (availableCount === 0) {
        text = isTransferBetweenWallets
            ? 'You have reached your daily transfer limit of {{allowedCount}} transfers between your Wallets. The limit will reset at 00:00 GMT.'
            : 'You have reached your daily transfer limit of {{allowedCount}} transfers between your {{sourceAccountName}} and {{targetAccountName}}. The limit will reset at 00:00 GMT.';
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

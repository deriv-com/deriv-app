export type TWithdrawalForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
};

export type TWithdrawalReceipt = {
    address?: string;
    amount?: string;
    fromAccount?: {
        currency?: string;
        loginid?: string;
    };
};

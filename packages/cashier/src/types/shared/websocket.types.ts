import { CryptoConfig } from '@deriv/api-types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (action: any, parameters: any) => Promise<any>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (args: {
        address: string;
        amount: number;
        verification_code: string;
        dry_run?: number;
    }) => Promise<any>;
    send: (obj: any) => Promise<any>;
};

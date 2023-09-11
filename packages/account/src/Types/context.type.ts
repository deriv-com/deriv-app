import { TToken } from './common-prop.type';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]>;
    deleteToken: (token: string) => Promise<void>;
    isSuccess: boolean;
};

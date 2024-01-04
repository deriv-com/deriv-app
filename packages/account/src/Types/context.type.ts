import { TToken } from './common.type';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]>;
    deleteToken: (token: string) => Promise<void>;
};

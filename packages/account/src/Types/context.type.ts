import { TToken } from './common-prop.type';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]> | undefined;
    deleteToken: (token: string) => Promise<void>;
    toggleOverlay: () => void;
};

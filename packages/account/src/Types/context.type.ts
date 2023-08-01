import { TToken } from './common-prop.type';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]> | undefined;
    deleteToken: (token: string) => Promise<void>;
    footer_ref: Element | DocumentFragment;
    overlay_ref: HTMLDivElement;
    toggleOverlay: () => void;
};

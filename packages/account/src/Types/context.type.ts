import { TToken } from './common-prop.type';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]> | undefined;
    deleteToken: (token: string) => Promise<void>;
    footer_ref: Element | DocumentFragment | undefined;
    overlay_ref:
        | ((...args: unknown[]) => unknown)
        | import('prop-types').InferProps<{
              current: import('prop-types').Requireable<unknown>;
          }>;
    toggleOverlay: () => void;
};

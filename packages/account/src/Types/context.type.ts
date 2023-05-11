import { TToken } from './common-prop.type';
import { InferProps, Requireable } from 'prop-types';

export type TApiContext = {
    api_tokens: NonNullable<TToken[]> | undefined;
    deleteToken: (token: string) => Promise<void>;
    footer_ref: Element | DocumentFragment | undefined;
    overlay_ref:
        | ((...args: unknown[]) => unknown)
        | InferProps<{
              current: Requireable<unknown>;
          }>;
    toggleOverlay: () => void;
};

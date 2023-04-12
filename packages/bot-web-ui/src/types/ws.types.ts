export type TDerivWS = {
    send: (data: unknown) => void;
    close: () => void;
    addEventListener: (event: string, callback: (ev: Event) => void) => void;
    removeEventListener: (event: string, callback: (ev: Event) => void) => void;
};

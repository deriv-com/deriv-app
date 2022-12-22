// eslint-disable-next-line import/no-mutable-exports
export let WS: Record<string, any>;

export const setWebsocket = (websocket: object) => {
    WS = websocket;
};

/**
 * A temporarily custom hook to expose the global `WS` object from the `shared` package.
 */
export const useWS = () => {
    return WS;
};

// eslint-disable-next-line import/no-mutable-exports
export let WS;

export const setWebsocket = websocket => {
    WS = websocket;
};

/**
 * A temporarily custom hook to expose the global `WS` object from the `shared` package.
 */
export const useWS = () => {
    return WS;
};

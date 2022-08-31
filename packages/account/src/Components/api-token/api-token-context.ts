/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';

const ApiTokenContext = React.createContext<import('Types').TApiContext>({
    api_tokens: [],
    toggleOverlay: () => {},
    deleteToken: () => {},
    footer_ref: null,
    overlay_ref: null,
});

export default ApiTokenContext;

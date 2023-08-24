import * as React from 'react';
import { TApiContext } from 'Types';

const ApiTokenContext = React.createContext<TApiContext>({
    api_tokens: undefined,
    overlay_ref: document.createElement('div'),
    footer_ref: document.createElement('div'),
    toggleOverlay: () => null,
    deleteToken: () => Promise.resolve(),
});

export default ApiTokenContext;

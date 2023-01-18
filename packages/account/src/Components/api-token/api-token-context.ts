import * as React from 'react';
import { TApiContext } from 'Types';

const ApiTokenContext = React.createContext<TApiContext>({
    loading: false,
    ws: {},
    update_error_message: () => {
        // will be injected by provider
    },
    toggle_loading: () => {
        // will be injected by provider
    },
    update_tokens: () => {
        // will be injected by provider
    },
});

export default ApiTokenContext;

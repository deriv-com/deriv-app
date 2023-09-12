import * as React from 'react';
import { TApiContext } from 'Types';

const ApiTokenContext = React.createContext<TApiContext>({
    api_tokens: [],
    deleteToken: () => Promise.resolve(),
    isSuccess: false,
});

export default ApiTokenContext;

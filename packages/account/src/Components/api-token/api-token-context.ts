import { createContext } from 'react';
import { TApiContext } from '../../Types';

const ApiTokenContext = createContext<TApiContext>({
    api_tokens: [],
    deleteToken: () => Promise.resolve(),
});

export default ApiTokenContext;

import { createContext } from 'react';

// Don't need to type DerivAPIBasic here, We will be using these methods inside
// the `useFetch`, `useRequest` and `useSubscription` hook to make it type-safe.
type TDerivAPIBasic = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe: any;
};

type TContext = { deriv_api: TDerivAPIBasic; is_standalone: boolean };

const APIContext = createContext<TContext | null>(null);

export default APIContext;

import { createContext } from 'react';

type TContext = {
    // Don't need to type `deriv_api` here, We will be using these methods inside
    // the `useFetch`, `useRequest` and `useSubscription` hook to make it type-safe.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deriv_api: Record<string, any>;
    is_standalone: boolean;
};

const APIContext = createContext<TContext | null>(null);

export default APIContext;

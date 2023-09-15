import { createContext } from 'react';

// Don't need to type `deriv_api` here, We will be using these methods inside
// the `useFetch`, `useRequest` and `useSubscription` hook to make it type-safe.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const APIContext = createContext<Record<string, any> | null>(null);

export default APIContext;

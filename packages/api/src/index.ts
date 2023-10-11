import useInfiniteQuery from './useInfiniteQuery';
import useMutation from './useMutation';
import useQuery from './useQuery';

export { default as APIProvider } from './APIProvider';
export { default as useInvalidateQuery } from './useInvalidateQuery';
export { default as usePaginatedFetch } from './usePaginatedFetch';
export { default as useSubscription } from './useSubscription';
export * from './hooks';

export {
    useQuery,
    useMutation,
    useInfiniteQuery,
    // replace this hook with `useQuery`.
    useQuery as useFetch,
    // replace this hook with `useMutation`.
    useMutation as useRequest,
};

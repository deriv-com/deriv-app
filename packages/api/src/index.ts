import useQuery from './useQuery';
import useMutation from './useMutation';
import useInfiniteQuery from './useInfiniteQuery';

export { default as APIProvider } from './APIProvider';
export { default as useInvalidateQuery } from './useInvalidateQuery';
export { default as usePaginatedFetch } from './usePaginatedFetch';
export { default as useSubscription } from './useSubscription';
export * from './hooks';

export {
    useQuery,
    useMutation,
    useInfiniteQuery,
    /** @deprecated use `useQuery` instead */
    useQuery as useFetch,
    /** @deprecated use `useMutation` instead */
    useMutation as useRequest,
};

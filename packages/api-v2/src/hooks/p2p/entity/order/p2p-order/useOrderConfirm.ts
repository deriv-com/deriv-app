import { useCallback, useMemo } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type Tpayload = NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_order_confirm'>>['mutate']>>[0]['payload'];

/**
 * A custom hook for handling P2P order confirmation
 *
 * @example
 * ```typescript
 * const { data, mutate } = useOrderConfirm();
 *
 * mutate({
 *    id: '1234',
 *    dry_run: 1,
 *    verification_code: 'verification_code',
 * });
 * // Access order confirmation details from 'data' and use 'mutate' function to confirm an order.
 * ```
 * **/
const useOrderConfirm = () => {
    const invalidate = useInvalidateQuery();

    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_order_confirm', {
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const modified_data = useMemo(() => {
        const p2p_order_confirm = data?.p2p_order_confirm;

        if (!p2p_order_confirm) return undefined;

        return {
            ...p2p_order_confirm,
            /** Indicates whether a dry run was successful or not (for dry run confirmations) **/
            is_dry_run_successful: Boolean(p2p_order_confirm.dry_run),
        };
    }, [data?.p2p_order_confirm]);

    const mutate = useCallback((payload: Tpayload) => _mutate({ payload }), [_mutate]);

    return {
        /** Order confirmation details **/
        data: modified_data,
        /** Function to confirm an order or perform a dry run (incase the dry_run option is specified in the payload) **/
        mutate,
        ...rest,
    };
};

export default useOrderConfirm;

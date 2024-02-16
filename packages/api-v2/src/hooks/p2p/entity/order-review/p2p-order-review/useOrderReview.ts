import { useCallback, useMemo } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TOrderReviewPayload = NonNullable<
    Parameters<ReturnType<typeof useMutation<'p2p_order_review'>>['mutate']>
>[0]['payload'];

/** A custom hook that creates a review for a specified order
 *
 * To create a review for an order, specify the required fields order_id and rating to the mutation payload:
 * @example
 *  mutate({
        order_id: '1234',
        rating: 4,
        recommended: 1 // optional
    });
 *
*/
const useOrderReview = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_order_review', {
        onSuccess: () => {
            invalidate('p2p_order_list');
        },
    });

    const mutate = useCallback(
        (payload: TOrderReviewPayload) => {
            _mutate({ payload });
        },
        [_mutate]
    );

    const modified_data = useMemo(() => {
        const p2p_order_review = data?.p2p_order_review;

        if (!p2p_order_review) return undefined;

        return {
            ...p2p_order_review,
            // Flag to check if the advertiser is recommended
            is_recommended: Boolean(p2p_order_review.recommended),
            // Flag to check if the advertiser has not been recommended yet
            has_not_been_recommended: p2p_order_review.recommended === null,
        };
    }, [data]);

    return {
        /** Data returned after a review was created for the order */
        data: modified_data,
        /** mutate function to create a review for a specified order */
        mutate,
        ...rest,
    };
};
export default useOrderReview;

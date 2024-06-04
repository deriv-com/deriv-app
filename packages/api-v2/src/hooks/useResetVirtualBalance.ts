import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

/** A  custom hook for resetting the virtual balance */
const useResetVirtualBalance = () => {
    const invalidate = useInvalidateQuery();

    const { mutate, ...rest } = useMutation('topup_virtual', {
        onSuccess: () => {
            invalidate('balance');
        },
    });

    return {
        /** The mutation function for resetting the virtual balance */
        mutate,
        ...rest,
    };
};

export default useResetVirtualBalance;

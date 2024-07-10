/* eslint-disable sort-keys */
import { useMutation } from '@deriv-app/api-v2';

/** A custom hook to request paymentagent transfer */
export const usePaymentAgentTransferRequest = () => {
    const { data, ...rest } = useMutation('paymentagent_transfer');

    /** Paymentagent transfer response */
    return {
        data,
        ...rest,
    };
};

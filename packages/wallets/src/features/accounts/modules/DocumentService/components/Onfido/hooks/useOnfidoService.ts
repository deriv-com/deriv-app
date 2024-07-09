import { useEffect } from 'react';
import { useOnfido } from '@deriv/api-v2';

const useOnfidoService = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isLoading,
    } = useOnfido();

    useEffect(() => {
        if (hasSubmitted) {
            onfidoRef?.current?.safeTearDown();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSubmitted, onfidoRef]);

    return {
        isLoading,
        isOnfidoSubmissionSuccessful: hasSubmitted,
        onfidoContainerId,
    };
};

export default useOnfidoService;

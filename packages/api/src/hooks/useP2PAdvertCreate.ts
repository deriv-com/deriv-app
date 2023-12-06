import { useCallback } from 'react';
import useMutation from '../useMutation';

/** A custom hook */
const useP2PAdvertCreate = () => {
    const invalidate = useInvalidateQuery();
    const { mutate: _mutate, ...rest } = useMutation('p2p_advert_create', {
        onSuccess: () => {
            // TODO: Invalidate other P2P hooks relating to Advert once the hooks are implemented
            invalidate('p2p_advert_create');
        },
    });

    const mutate = useCallback(
        (documentIds: string[]) =>
            _mutate({
                payload: {
                    category: 'authentication',
                    event: 'poi_documents_uploaded',
                    args: {
                        documents: documentIds,
                    },
                },
            }),
        [_mutate]
    );

    return {
        mutate,
        ...rest,
    };
};

export default useP2PAdvertCreate;

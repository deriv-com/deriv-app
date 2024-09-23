import { useSnackbar } from '@deriv-com/quill-ui';
import React from 'react';

const useSnackbarOnce = () => {
    const { addSnackbar } = useSnackbar();

    const showSnackbarOnce = React.useCallback(
        (message: React.ReactNode) => {
            addSnackbar({
                message,
                status: 'fail',
                hasCloseButton: true,
                style: { marginBottom: '48px' },
            });
        },
        [addSnackbar]
    );

    return showSnackbarOnce;
};

export default useSnackbarOnce;

import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { SnackbarController, useSnackbar } from '@deriv-com/quill-ui';
import useTradeError, { TErrorFields } from '../../Hooks/useTradeError';

const TradeErrorSnackbar = observer(
    ({ error_fields, should_show_snackbar }: { error_fields: TErrorFields[]; should_show_snackbar?: boolean }) => {
        const {
            client: { is_logged_in },
        } = useStore();
        const { addSnackbar } = useSnackbar();
        const { is_error_matching_field: has_error, message } = useTradeError({
            error_fields, // array with BE error_fields, for which we will track errors.
        });

        React.useEffect(() => {
            if (has_error && should_show_snackbar) {
                addSnackbar({
                    message,
                    status: 'fail',
                    hasCloseButton: true,
                    hasFixedHeight: false,
                    style: {
                        marginBottom: is_logged_in ? '48px' : '-8px',
                        width: 'calc(100% - var(--core-spacing-800)',
                    },
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [has_error, should_show_snackbar]);

        return <SnackbarController />;
    }
);

export default TradeErrorSnackbar;

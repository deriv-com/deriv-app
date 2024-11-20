import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { SnackbarController, useSnackbar } from '@deriv-com/quill-ui';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { useTraderStore } from 'Stores/useTraderStores';
import useTradeParamError, { TTradeParams } from '../../Hooks/useTradeParamError';

const TradeParamErrorSnackbar = observer(
    ({ trade_params, should_show_snackbar }: { trade_params: TTradeParams[]; should_show_snackbar?: boolean }) => {
        const {
            client: { is_logged_in },
        } = useStore();
        const { contract_type, proposal_info, validation_errors, trade_type_tab, trade_types } = useTraderStore();
        const { addSnackbar } = useSnackbar();
        const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
        const { is_error_matching_trade_param: has_error, message } = useTradeParamError({
            proposal_info,
            contract_type: contract_types[0],
            validation_errors,
            trade_params, // array with trade params, for which we will track errors. They should match error_field
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
        }, [has_error, contract_type, should_show_snackbar]);

        return <SnackbarController />;
    }
);

export default TradeParamErrorSnackbar;

import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';

import { getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';

import useTradeError from 'AppV2/Hooks/useTradeError';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import { useTraderStore } from 'Stores/useTraderStores';

import { TTradeParametersProps } from '../trade-parameters';

import StakeInput from './stake-input';

const Stake = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        amount,
        currency,
        contract_type,
        has_open_accu_contract,
        is_market_closed,
        is_multiplier,
        trade_types,
        trade_type_tab,
        proposal_info,
    } = useTraderStore();
    const { is_error_matching_field: has_error } = useTradeError({ error_fields: ['stake', 'amount'] });

    const [is_open, setIsOpen] = React.useState(false);

    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    const is_all_types_with_errors = contract_types.every(item => proposal_info?.[item]?.has_error);

    // Showing snackbar for all cases, except when it is Rise/Fall or Digits and only one subtype has error
    const should_show_snackbar = contract_types.length === 1 || is_multiplier || is_all_types_with_errors;

    const onClose = React.useCallback(() => setIsOpen(false), []);

    return (
        <React.Fragment>
            <TextField
                disabled={has_open_accu_contract || is_market_closed}
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
                noStatusIcon
                onClick={() => setIsOpen(true)}
                value={`${amount} ${getCurrencyDisplayCode(currency)}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                status={has_error && should_show_snackbar ? 'error' : 'neutral'}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Stake' />} />
                    <StakeInput onClose={onClose} is_open={is_open} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default Stake;

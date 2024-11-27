import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';

import { getCurrencyDisplayCode } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';

import useTradeError from 'AppV2/Hooks/useTradeError';
import { useTraderStore } from 'Stores/useTraderStores';

import { TTradeParametersProps } from '../trade-parameters';

import StakeInput from './stake-input';

const Stake = observer(({ is_minimized }: TTradeParametersProps) => {
    const { amount, currency, has_open_accu_contract, is_market_closed } = useTraderStore();
    const { is_error_matching_field: has_error } = useTradeError({ error_fields: ['stake', 'amount'] });

    const [is_open, setIsOpen] = React.useState(false);

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
                status={has_error ? 'error' : 'neutral'}
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

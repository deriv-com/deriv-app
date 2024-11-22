import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { TTradeParametersProps } from '../trade-parameters';
import StakeInput from './stake-input';

const Stake = observer(({ is_minimized }: TTradeParametersProps) => {
    const { amount, currency, has_open_accu_contract, is_market_closed } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    // TODO: add hook for errors
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
                // status={stake_error ? 'error' : 'neutral'}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <StakeInput onClose={onClose} is_open={is_open} />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default Stake;

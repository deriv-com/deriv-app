import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';

type TStakeProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'amount' | 'basis' | 'currency' | 'onChange'>;

const Stake = ({ amount, basis, currency, onChange, is_minimized }: TStakeProps) => {
    React.useEffect(() => {
        if (basis === 'payout') onChange({ target: { name: 'basis', value: 'stake' } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

    if (basis === 'payout') return null;
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Stake' />}
            value={`${amount} ${currency}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default Stake;

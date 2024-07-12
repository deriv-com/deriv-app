import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';

type TStakeProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'amount' | 'basis' | 'currency' | 'onChange'>;

const BASIS = {
    PAYOUT: 'payout',
    STAKE: 'stake',
};

const Stake = ({ amount, basis, currency, onChange, is_minimized }: TStakeProps) => {
    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

    if (basis === BASIS.PAYOUT) return null;
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Stake' />}
            value={`${amount} ${getCurrencyDisplayCode(currency)}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default Stake;

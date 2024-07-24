import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';

type TStakeProps = {
    is_minimized?: boolean;
};

const BASIS = {
    PAYOUT: 'payout',
    STAKE: 'stake',
};

const Stake = observer(({ is_minimized }: TStakeProps) => {
    const { amount, basis, currency, onChange } = useTraderStore();

    React.useEffect(() => {
        if (basis === BASIS.PAYOUT) onChange({ target: { name: 'basis', value: BASIS.STAKE } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

    if (basis === BASIS.PAYOUT) return null;
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
            value={`${amount} ${getCurrencyDisplayCode(currency)}`}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
});

export default Stake;

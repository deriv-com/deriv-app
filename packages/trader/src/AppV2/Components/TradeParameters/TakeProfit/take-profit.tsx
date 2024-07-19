import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';

type TTakeProfitProps = {
    is_minimized?: boolean;
};

const TakeProfit = observer(({ is_minimized }: TTakeProfitProps) => {
    const { currency, has_open_accu_contract, take_profit } = useTraderStore();
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Take profit' />}
            value={take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : localize('Not set')}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            disabled={has_open_accu_contract}
        />
    );
});

export default TakeProfit;

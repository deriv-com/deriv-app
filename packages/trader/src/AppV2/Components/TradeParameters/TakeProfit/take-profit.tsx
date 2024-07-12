import React from 'react';
import { TextField } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import clsx from 'clsx';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';

type TTakeProfitProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'currency' | 'has_open_accu_contract' | 'take_profit'>;

const TakeProfit = ({ currency, has_open_accu_contract, is_minimized, take_profit }: TTakeProfitProps) => {
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
};

export default TakeProfit;

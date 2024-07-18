import React from 'react';
import { Dropdown } from '@deriv/components';
import { TTextValueStrings } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';

type TTemporaryAssetsProps = {
    symbols: TTextValueStrings[];
} & Pick<ReturnType<typeof useTraderStore>, 'onChange' | 'symbol'>;

const TemporaryAssets = ({ onChange, symbol, symbols }: TTemporaryAssetsProps) => (
    <div className='trade__assets'>
        <Dropdown list={symbols} name='symbol' onChange={onChange} value={symbol} />
    </div>
);

export default React.memo(TemporaryAssets);

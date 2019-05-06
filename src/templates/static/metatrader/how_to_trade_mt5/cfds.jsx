import React             from 'react';
import { BuySellImage }  from '../../get_started/common.jsx';
import { SeparatorLine } from '../../../_common/components/separator_line.jsx';

const CFDs = () => (
    <div className='gr-10 gr-push-1'>
        <div className='center-text'>
            <h2>{it.L('How to trade CFDs')}</h2>
            <p>{it.L('New to CFD trading? We explain a few basics that all CFD traders need to know before they start trading.')}</p>

            <SeparatorLine className='gr-padding-30' />

            <h2>{it.L('When to buy and sell')}</h2>
            <p>{it.L('When you are trading CFDs, you can choose to open a buy position (if you think that the price will rise) or a sell position (if you think that the price will fall).')}</p>
            <BuySellImage />
            <p>{it.L('Let\'s use the US 100 index as an example:')}</p>
            <p>{it.L('If you decide to buy or \'go long\' on the US 100 index, your profit will continue to increase as long as the price of the US 100 index keeps rising. However, if the price falls, the losses you incur will also increase.')}</p>
            <p>{it.L('The opposite is true if you decide to sell or \'go short\' on the US 100 index. This means that your profit will continue to increase as long as the price of the US 100 index keeps falling. However, if the price rises, the losses you incur will also increase.')}</p>

            <SeparatorLine className='gr-padding-30' />

            <h2>{it.L('How to calculate your profits and losses')}</h2>
            <p>{it.L('Let\'s say a US 100 contract is worth USD 1 per point in the underlying asset. If you decide to \'go long\' on the US 100, and the asset price rises by 10 points, that represents a USD 10 profit for you.')}</p>
            <p>{it.L('However, if the asset price falls by 10 points, that represents a USD 10 loss for you.')}</p>

            <SeparatorLine className='gr-padding-30' />

            <h2>{it.L('How to close a position')}</h2>
            <p>{it.L('When you decide to close an open contract, you only need to take the opposite position in order to close the contract.')}</p>
            <p>{it.L('For example, if you buy a US 100 contract and it\'s not going as planned, you just need to sell it to cut your losses at the current market price.')}</p>
        </div>
    </div>
);

export default CFDs;

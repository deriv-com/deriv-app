import React from 'react';
import { Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const MarketIsClosedOverlay = ({ onClick }) => (
    <div className='market-is-closed-overlay'>
        <p>
            <Localize i18n_default_text='Market is closed.' />
        </p>
        <p>
            <Localize i18n_default_text='Try Synthetic Indices which simulate real-world market volatility and are open 24/7.' />
        </p>
        <Button
            className='market-is-closed-overlay__button'
            onClick={onClick}
            text={localize('Try Synthetic Indices')}
            primary
        />
    </div>
);

export default MarketIsClosedOverlay;

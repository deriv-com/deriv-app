import React from 'react';
import { Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MarketIsClosedOverlay = ({ onClick, is_financial_account }) => (
    <div className='market-is-closed-overlay'>
        <p>
            <Localize i18n_default_text='Market is closed.' />
        </p>
        {!is_financial_account && (
            <div>
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
        )}
    </div>
);

export default connect(({ client }) => ({
    is_financial_account: client.is_financial_account,
}))(MarketIsClosedOverlay);

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';

const MarketClosedCountdownTimer = ({ is_dark_mode_on, market_countdown_timer }) => (
    <React.Fragment>
        <div
            className={classNames('contract-card--market-closed', {
                'contract-card--market-closed--dark': is_dark_mode_on,
            })}
        >
            <p className='contract-card--market-closed--heading'>
                <Localize i18n_default_text='Market is closed' />
            </p>
            {market_countdown_timer}
        </div>
    </React.Fragment>
);

MarketClosedCountdownTimer.propTypes = {
    is_dark_mode_on: PropTypes.bool,
};

export default MarketClosedCountdownTimer;

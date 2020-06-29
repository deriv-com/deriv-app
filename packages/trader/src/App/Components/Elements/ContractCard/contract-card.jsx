import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const ContractCard = ({ is_multiplier, children, profit_loss, is_sold, is_dark_mode_on }) => (
    <div
        className={classNames('contract-card', {
            'contract-card--green': !is_multiplier && profit_loss > 0 && !is_sold,
            'contract-card--red': !is_multiplier && profit_loss < 0 && !is_sold,
        })}
    >
        {children}
        <div
            className={classNames('contract-card--market-closed', {
                'contract-card--market-closed--dark': is_dark_mode_on,
            })}
        >
            <p className='contract-card--market-closed--heading'>
                <Localize i18n_default_text='Market is closed' />
            </p>
            <MarketCountdownTimer target_date='2020-07-29' />
        </div>
    </div>
);

ContractCard.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    is_sold: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    profit_loss: PropTypes.number,
};

export default connect(({ ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
}))(ContractCard);

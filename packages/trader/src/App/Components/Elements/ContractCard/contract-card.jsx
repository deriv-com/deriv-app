import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getEndTime } from 'Stores/Modules/Contract/Helpers/logic';
import MarketCountdownTimer from '../market-countdown-timer.jsx';

const ContractCard = ({
    is_multiplier,
    children,
    profit_loss,
    is_sold,
    is_dark_mode_on,
    is_market_closed,
    contract_info,
}) => (
    <div
        className={classNames('contract-card', {
            'contract-card--green': !is_multiplier && profit_loss > 0 && !is_sold,
            'contract-card--red': !is_multiplier && profit_loss < 0 && !is_sold,
        })}
    >
        {children}
        {is_market_closed && !getEndTime(contract_info) && (
            <div
                className={classNames('contract-card--market-closed', {
                    'contract-card--market-closed--dark': is_dark_mode_on,
                })}
            >
                <p className='contract-card--market-closed--heading'>
                    <Localize i18n_default_text='Market is closed' />
                </p>
                <MarketCountdownTimer />
            </div>
        )}
    </div>
);

ContractCard.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    is_sold: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    profit_loss: PropTypes.number,
    contract_info: PropTypes.object,
    is_market_closed: PropTypes.bool,
};

export default connect(({ modules, ui }) => ({
    is_market_closed: modules.trade.is_market_closed,
    is_dark_mode_on: ui.is_dark_mode_on,
}))(ContractCard);

import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LimitOrdersDialog from 'Modules/Trading/Containers/Multiplier/limit-orders-dialog.jsx';

const LimitOrderInfo = ({
    currency,
    stop_loss,
    take_profit,
    has_take_profit,
    has_stop_loss,
    cancellation_duration,
    has_cancellation,
}) => {
    const [is_dialog_open, setDialogOpen] = React.useState(false);
    return (
        <React.Fragment>
            <LimitOrdersDialog is_open={is_dialog_open} onClose={() => setDialogOpen(false)} />
            <div className='mobile-widget' onClick={() => setDialogOpen(!is_dialog_open)}>
                <div className='mobile-widget__item'>
                    <div className='mobile-widget__item-label'>{localize('Take profit')}</div>
                    <div className='mobile-widget__item-value'>
                        {has_take_profit && <Money amount={take_profit} currency={currency} />}
                    </div>
                </div>
                <div className='mobile-widget__item'>
                    <div className='mobile-widget__item-label'>{localize('Stop loss')}</div>
                    <div className='mobile-widget__item-value'>
                        {has_stop_loss && <Money amount={stop_loss} currency={currency} />}
                    </div>
                </div>
                <div className='mobile-widget__item'>
                    <div className='mobile-widget__item-label'>{localize('Deal Cancellation')}</div>
                    <div className='mobile-widget__item-value'>{has_cancellation && cancellation_duration}</div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(({ modules }) => ({
    currency: modules.trade.currency,
    stop_loss: modules.trade.stop_loss,
    has_stop_loss: modules.trade.has_stop_loss,
    take_profit: modules.trade.take_profit,
    has_take_profit: modules.trade.has_take_profit,
    cancellation_duration: modules.trade.cancellation_duration,
    has_cancellation: modules.trade.has_cancellation,
}))(LimitOrderInfo);

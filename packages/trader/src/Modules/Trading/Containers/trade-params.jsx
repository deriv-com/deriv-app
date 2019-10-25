import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import Amount                         from 'Modules/Trading/Components/Form/TradeParams/amount.jsx';
import Barrier                        from 'Modules/Trading/Components/Form/TradeParams/barrier.jsx';
import Duration                       from 'Modules/Trading/Components/Form/TradeParams/Duration';
import LastDigit                      from 'Modules/Trading/Components/Form/TradeParams/last-digit.jsx';
import StopLoss                       from 'Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss.jsx';
import TakeProfit                     from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx';
import { connect }                    from 'Stores/connect';

class TradeParams extends React.Component {
    isVisible(component_key) {
        return this.props.form_components.includes(component_key);
    }

    render () {
        const { is_minimized } = this.props;
        return (
            <React.Fragment>
                {
                    this.isVisible('duration') &&
                    <Duration key={'duration'} is_minimized={is_minimized} />
                }
                {
                    this.isVisible('barrier') &&
                    <Barrier key={'barrier'} is_minimized={is_minimized} />
                }
                {
                    this.isVisible('last_digit') &&
                    <LastDigit key={'last_digit'} is_minimized={is_minimized} />
                }
                {
                    this.isVisible('amount') &&
                    <Amount key={'amount'} is_minimized={is_minimized} />
                }
                {
                    this.isVisible('take_profit') &&
                    <TakeProfit key={'take_profit'} />
                }
                {
                    this.isVisible('stop_loss') &&
                    <StopLoss key={'stop_loss'} />
                }
            </React.Fragment>
        );
    }
}
TradeParams.propTypes = {
    form_components: MobxPropTypes.arrayOrObservableArray,
    is_minimized   : PropTypes.bool,
};

export default connect(({ modules }) => ({
    form_components: modules.trade.form_components,
}))(TradeParams);

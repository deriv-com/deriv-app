import React from 'react';
import { Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getExpiryType, getDurationMinMaxValues } from 'Stores/Modules/Trading/Helpers/duration';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import {
    MultiplierAmountWidget,
    MultiplierOptionsWidget,
} from 'Modules/Trading/Components/Form/TradeParams/Multiplier/amount-widget.jsx';
import TradeParamsModal from '../../Containers/trade-params-mobile.jsx';

class MobileWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
    }

    componentDidUpdate() {
        this.assertDurationIsWithinBoundary();
    }

    assertDurationIsWithinBoundary() {
        const { duration_min_max, duration, duration_unit, trade_store, onChange, onChangeUiStore } = this.props;

        const contract_expiry_type = getExpiryType(trade_store);
        const [min_value, max_value] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, duration_unit);

        if (contract_expiry_type === 'tick' && duration < min_value) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: min_value });
            onChange({ target: { name: 'duration', value: min_value } });
        }
        if (!(duration < min_value) && duration > max_value) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: max_value });
            onChange({ target: { name: 'duration', value: max_value } });
        }
    }

    toggleWidget = () => {
        this.setState({
            is_open: !this.state.is_open,
        });
    };

    getHumanReadableDuration() {
        const { duration, duration_unit } = this.props;
        const lookup = {
            t: [localize('tick'), localize('ticks')],
            s: [localize('second'), localize('seconds')],
            m: [localize('min'), localize('mins')],
            h: [localize('hour'), localize('hours')],
            d: [localize('day'), localize('days')],
        };
        const formatted_duration_unit = +duration === 1 ? lookup[duration_unit][0] : lookup[duration_unit][1];

        return `${duration} ${formatted_duration_unit}`;
    }

    isVisible = component => {
        return this.props.form_components.includes(component);
    };

    render() {
        const { amount, basis, currency, last_digit, is_multiplier } = this.props;

        const localized_basis = getLocalizedBasis();

        const stakeOrPayout = () => {
            switch (basis) {
                case 'stake':
                    return localized_basis.stake;
                case 'payout':
                    return localized_basis.payout;
                default:
                    return basis;
            }
        };

        return (
            <div className='mobile-widget__wrapper'>
                {is_multiplier ? (
                    <React.Fragment>
                        <MultiplierAmountWidget />
                        <MultiplierOptionsWidget />
                    </React.Fragment>
                ) : (
                    <div className='mobile-widget' onClick={this.toggleWidget}>
                        <div className='mobile-widget__duration'>{this.getHumanReadableDuration()}</div>
                        <div className='mobile-widget__amount'>
                            <Money amount={amount} currency={currency} show_currency />
                        </div>
                        <div className='mobile-widget__type'>{stakeOrPayout()}</div>
                    </div>
                )}
                <TradeParamsModal is_open={this.state.is_open} toggleModal={this.toggleWidget} />
                {this.isVisible('last_digit') && this.props.is_collapsed && (
                    <div className='mobile-widget' onClick={this.props.toggleDigitsWidget}>
                        <div className='mobile-widget__amount'>
                            <Localize i18n_default_text='Digit: {{last_digit}} ' values={{ last_digit }} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(({ modules, ui }) => ({
    amount: modules.trade.amount,
    basis: modules.trade.basis,
    currency: modules.trade.currency,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    onChange: modules.trade.onChange,
    onChangeUiStore: ui.onChangeUiStore,
    duration_min_max: modules.trade.duration_min_max,
    trade_store: modules.trade,
    form_components: modules.trade.form_components,
    last_digit: modules.trade.last_digit,
    is_multiplier: modules.trade.is_multiplier,
}))(MobileWidget);

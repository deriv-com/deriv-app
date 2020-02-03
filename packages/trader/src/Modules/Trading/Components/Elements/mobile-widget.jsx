import React from 'react';
import { Money, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import TradeParamsMobile from '../../Containers/trade-params-mobile.jsx';

class MobileWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
        };
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

    render() {
        const { amount, basis, currency } = this.props;

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
            <React.Fragment>
                <div className='mobile-widget' onClick={this.toggleWidget}>
                    <div className='mobile-widget__duration'>{this.getHumanReadableDuration()}</div>
                    <div className='mobile-widget__amount'>
                        <Money amount={amount} currency={currency} />
                    </div>
                    <div className='mobile-widget__type'>{stakeOrPayout()}</div>
                </div>
                <Modal
                    id='dt_trade_parameters_mobile'
                    className='trade-params'
                    enableApp={this.props.enableApp}
                    is_open={this.state.is_open}
                    is_vertical_top
                    disableApp={this.props.disableApp}
                    toggleModal={this.toggleWidget}
                    height='auto'
                    width='calc(100vw - 32px)'
                >
                    <div className='mobile-widget-dialog__wrapper'>
                        <TradeParamsMobile toggleModal={this.toggleWidget} is_nativepicker />
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default connect(({ modules, ui }) => ({
    amount: modules.trade.amount,
    basis: modules.trade.basis,
    currency: modules.trade.currency,
    duration: modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(MobileWidget);

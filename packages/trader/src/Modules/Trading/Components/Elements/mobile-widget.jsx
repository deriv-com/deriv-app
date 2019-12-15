import React                 from 'react';
import { Money }             from 'deriv-components';
import { Localize }          from 'deriv-translations';
import { connect }           from 'Stores/connect';
import { getLocalizedBasis } from 'Stores/Modules/Trading/Constants/contract';
import MobileDialog          from './mobile-dialog.jsx';
import TradeParams           from '../../Containers/trade-params.jsx';

class MobileWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state             = {
            open: false,
        };
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
    }

    handleWidgetClick() {
        this.setState({
            open: true,
        });
    }

    handleDialogClose() {
        this.setState({
            open: false,
        });
    }

    getHumanReadableDuration() {
        const { duration, duration_unit } = this.props;
        const lookup                      = {
            t: ['Tick', 'Ticks'],
            s: ['Second', 'Seconds'],
            m: ['Minute', 'Minutes'],
            h: ['Hour', 'Hours'],
            d: ['Day', 'days'],
        };

        return (
            <Localize
                i18n_default_text='{{duration}} {{formatted_duration_unit}}'
                values={{
                    duration,
                    formatted_duration_unit: +duration === 1 ? lookup[duration_unit][0] : lookup[duration_unit][1],
                }}
            />
        );
    }

    render() {
        const {
            amount,
            basis,
            currency,
        } = this.props;

        const localized_basis = getLocalizedBasis();

        const stakeOrPayout = () => {
            switch (basis) {
                case 'stake':
                    return localized_basis.payout;
                case 'payout':
                    return localized_basis.stake;
                default:
                    return basis;
            }
        };

        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={this.handleWidgetClick}>
                    <div className='mobile-trade-params-btn'>
                        <div className='mobile-trade-params-btn__duration'>
                            {this.getHumanReadableDuration()}
                        </div>
                        <div className='mobile-trade-params-btn__amount'>
                            <Money
                                amount={amount}
                                currency={currency}
                            />
                        </div>
                        <div className='mobile-trade-params-btn__type'>
                            {stakeOrPayout()}
                        </div>
                    </div>
                </div>

                <MobileDialog
                    title='Set parameters'
                    visible={this.state.open}
                    onClose={this.handleDialogClose}
                >
                    <TradeParams is_nativepicker />
                </MobileDialog>
            </React.Fragment>
        );
    }
}

export default connect(({ modules }) => ({
    amount       : modules.trade.amount,
    basis        : modules.trade.basis,
    currency     : modules.trade.currency,
    duration     : modules.trade.duration,
    duration_unit: modules.trade.duration_unit,
}))(MobileWidget);

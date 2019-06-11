import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { localize }             from '_common/localize';
import Icon                     from 'Assets/icon.jsx';
import { getUnderlyingPipSize } from 'Stores/Modules/Trading/Helpers/active-symbols';
import {
    epochToMoment,
    toGMTFormat }               from 'Utils/Date';
import {
    addCommaToNumber,
    getBarrierLabel,
    getBarrierValue  }          from './helpers';
import ResultDetailsItem        from './result-details-item.jsx';

class ResultDetails extends React.PureComponent {
    state = {
        is_open: this.props.is_open || false,
    };

    toggleDetails = () => {
        this.setState({ is_open: !this.state.is_open }, this.handleShade);
    }

    handleShade = () => {
        this.props.is_shade_visible(this.state.is_open);
    }

    componentDidMount = async () => {
        const decimal_places = await getUnderlyingPipSize(this.props.contract_info.underlying);
        this.setState({ decimal_places });
    }

    render() {
        const {
            contract_end_time,
            contract_info,
            duration,
            duration_unit,
            exit_spot,
            has_result,
        } = this.props;
        if (!has_result) return null;
        return (
            <React.Fragment>
                <div className={classNames('result-details__wrapper', {
                    'result-details__wrapper--is-open': this.state.is_open,
                })}
                >
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Ref. ID (Buy)')}
                            value={contract_info.transaction_ids.buy}
                        />
                        <ResultDetailsItem
                            label={localize('Ref. ID (Sell)')}
                            value={contract_info.transaction_ids.sell}
                        />
                    </div>
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Duration')}
                            value={(contract_info.tick_count > 0) ?
                                `${contract_info.tick_count} ${(contract_info.tick_count < 2) ? localize('tick') : localize('ticks')}`
                                :
                                `${duration} ${duration_unit}`}
                        />
                        <ResultDetailsItem
                            label={getBarrierLabel(contract_info)}
                            value={getBarrierValue(contract_info) || ' - '}
                        />
                    </div>
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Entry spot')}
                            value={addCommaToNumber(contract_info.entry_spot, this.state.decimal_places) || ' - '}
                        />
                        <ResultDetailsItem
                            label={localize('Exit spot')}
                            value={addCommaToNumber(exit_spot, this.state.decimal_places) || ' - '}
                        />
                    </div>
                    <div className='result-details__grid'>
                        <ResultDetailsItem
                            label={localize('Start time')}
                            value={toGMTFormat(epochToMoment(contract_info.purchase_time)) || ' - '}
                        />
                        <ResultDetailsItem
                            label={localize('End time')}
                            value={toGMTFormat(epochToMoment(contract_end_time)) || ' - '}
                        />
                    </div>
                </div>
                <div
                    className={classNames('result-details__toggle', {
                        'result-details__toggle--is-open': this.state.is_open,
                    })}
                    onClick={this.toggleDetails}
                >
                    <Icon icon='IconArrow' className='result-details__select-arrow' />
                </div>
            </React.Fragment>
        );
    }
}

ResultDetails.propTypes = {
    contract_end_time: PropTypes.PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    contract_info: PropTypes.object,
    duration     : PropTypes.number,
    duration_unit: PropTypes.string,
    exit_spot    : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    has_result   : PropTypes.bool,
    is_open      : PropTypes.bool,
};

export default ResultDetails;

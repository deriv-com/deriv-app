import { observer }       from 'mobx-react';
import PropTypes          from 'prop-types';
import React              from 'react';
import DigitDisplay       from './digit-display.jsx';
import LastDigitPointer   from './last-digit-pointer.jsx';

const display_array = Array.from(Array(10).keys()); // digits array [0 - 9]

class LastDigitPrediction extends React.Component {
    digit_left_offset = {
        0: 6,
        1: 6 + (this.props.dimension * 1),
        2: 6 + (this.props.dimension * 2),
        3: 6 + (this.props.dimension * 3),
        4: 6 + (this.props.dimension * 4),
        5: 6 + (this.props.dimension * 5),
        6: 6 + (this.props.dimension * 6),
        7: 6 + (this.props.dimension * 7),
        8: 6 + (this.props.dimension * 8),
        9: 6 + (this.props.dimension * 9),
    }

    getBarrier = (num) => {
        const  { barrier, contract_type } = this.props;

        const barrier_map = {
            DIGITMATCH: (val) => val === barrier,
            DIGITDIFF : (val) => (val !== barrier) && !isNaN(barrier),
            DIGITOVER : (val) => val > barrier,
            DIGITUNDER: (val) => val < barrier,
            DIGITODD  : (val) => val % 2,
            DIGITEVEN : (val) => !(val % 2),
        };
        if (!contract_type || !barrier_map[contract_type]) return null;
        return barrier_map[contract_type](num) ? num : null;
    };

    render() {
        const {
            digits,
            digits_info,
            is_digit_contract,
            has_entry_spot,
            is_ended,
            is_trade_page,
            tick,
            status } = this.props;
        const digits_array = Object.keys(digits_info).sort().map(spot_time => digits_info[spot_time]);
        const last_contract_digit = digits_array.slice(-1)[0] || {};

        // 'won' or 'lost' status exists after contract expiry
        const is_won = is_ended && (status === 'won') && is_digit_contract;
        // need to explicitly have is_lost condition here
        // because negating is_won would always be true,
        // but we only need is_lost condition only once we have the 'won' or 'lost' status
        const is_lost = is_ended && (status === 'lost') && is_digit_contract;

        const min = digits ? Math.min(...digits) : null;
        const max = digits ? Math.max(...digits) : null;

        // latest last digit refers to digit and spot values from latest price
        // latest contract digit refers to digit and spot values from last digit contract in contracts array
        const latest_tick_pip_size   = tick ? +(tick.pip_size) : null;
        const latest_tick_ask_price  = tick ? (tick.ask.toFixed(latest_tick_pip_size)) : null;
        const latest_tick_digit = latest_tick_ask_price ? +(latest_tick_ask_price.split('').pop()) : null;
        const position = tick ?
            this.digit_left_offset[latest_tick_digit] : this.digit_left_offset[last_contract_digit.digit];
        const latest_digit = !(is_won || is_lost) ?
            { digit: latest_tick_digit, spot: latest_tick_ask_price } : last_contract_digit;
        return (
            <div
                ref={node => this.node = node}
                className='digits'
            >
                { display_array.map((idx) => (
                    <DigitDisplay
                        barrier={this.getBarrier(idx)}
                        has_entry_spot={has_entry_spot}
                        is_digit_contract={is_digit_contract}
                        is_lost={is_lost}
                        is_trade_page={is_trade_page}
                        is_won={is_won}
                        key={idx}
                        is_max={digits ? (digits[idx] === max) : null}
                        is_min={digits ? (digits[idx] === min) : null}
                        stats={ digits ? digits[idx] : null}
                        status={status}
                        latest_digit={is_trade_page ? latest_digit : last_contract_digit}
                        value={idx}
                    />
                ))}
                <LastDigitPointer
                    is_lost={is_lost}
                    is_trade_page={is_trade_page}
                    is_won={is_won}
                    position={position}
                />
            </div>
        );
    }
}

LastDigitPrediction.propTypes = {
    barrier      : PropTypes.number,
    contract_type: PropTypes.string,
    digits_info  : PropTypes.object,
    is_ended     : PropTypes.bool,
    status       : PropTypes.string,
};

export default observer(LastDigitPrediction);

import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import { Bounce }   from 'App/Components/Animations';
import Digit        from './digit.jsx';
import DigitSpot    from './digit-spot.jsx';
import LastDigitStat from './last-digit-stat.jsx';

const DigitDisplay = ({
    barrier,
    is_digit_contract,
    has_entry_spot,
    is_lost,
    is_max,
    is_min,
    is_won,
    latest_digit,
    status,
    stats,
    value,
}) => {
    const { digit, spot }     = latest_digit;
    const is_latest           = value === digit;
    const is_selected         = value === barrier;
    const is_selected_winning = digit === barrier;
    const percentage          = stats ? stats * 100 / 1000 : null;
    return (
        <div
            className={classNames('digits__digit', {
                'digits__digit--latest': is_latest,
                'digits__digit--win'   : is_won && is_latest,
                'digits__digit--loss'  : is_lost && is_latest,
            })}
        >
            <LastDigitStat
                is_min={is_min}
                is_max={is_max}
                is_selected={is_selected}
                percentage={percentage}
            />
            <Bounce
                is_visible={!!(
                    is_digit_contract && is_latest && spot && status && has_entry_spot
                )}
                className='digits__digit-spot'
                keyname='digits__digit-spot'
            >
                <DigitSpot
                    current_spot={spot}
                    is_lost={is_lost}
                    is_selected_winning={is_selected_winning}
                    is_visible={!!(is_latest && spot)}
                    is_won={is_won}
                />
            </Bounce>
            <Digit
                is_latest={is_latest}
                is_lost={is_lost}
                is_selected={is_selected}
                is_won={is_won}
                percentage={percentage}
                value={value}
            />
        </div>
    );
};

DigitDisplay.propTypes = {
    barrier       : PropTypes.number,
    has_entry_spot: PropTypes.bool,
    is_lost       : PropTypes.bool,
    is_won        : PropTypes.bool,
    latest_digit  : PropTypes.object,
    value         : PropTypes.number,
};

export default observer(DigitDisplay);

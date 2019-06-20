import classNames   from 'classnames';
import { observer } from 'mobx-react';
import PropTypes    from 'prop-types';
import React        from 'react';
import Digit        from './digit.jsx';
import DigitSpot    from './digit-spot.jsx';

const DigitDisplay = ({
    barrier,
    is_lost,
    is_trade_page,
    is_won,
    latest_digit,
    value,
}) => {
    const { digit, spot } = latest_digit;
    const is_latest       = value === digit;
    const is_selected     = value === barrier;

    return (
        <div
            className={classNames('digits__digit', {
                'digits__digit--win' : is_won && is_latest,
                'digits__digit--loss': is_lost && is_latest,
            })}
        >
            { is_latest && spot &&
                <DigitSpot
                    current_spot={spot}
                    is_lost={is_lost}
                    is_won={is_won}
                />
            }
            <Digit
                is_latest={is_latest}
                is_lost={is_lost}
                is_trade_page={is_trade_page}
                is_selected={is_selected}
                is_won={is_won}
                value={value}
            />
        </div>
    );
};

DigitDisplay.propTypes = {
    barrier      : PropTypes.number,
    is_lost      : PropTypes.bool,
    is_trade_page: PropTypes.bool,
    is_won       : PropTypes.bool,
    latest_digit : PropTypes.object,
    value        : PropTypes.number,
};

export default observer(DigitDisplay);

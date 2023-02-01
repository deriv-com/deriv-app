import classNames from 'classnames';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Bounce } from 'App/Components/Animations';
import Digit from './digit.jsx';
import DigitSpot from './digit-spot.jsx';
import LastDigitStat from './last-digit-stat.jsx';

const DigitDisplay = ({
    barrier,
    is_digit_contract,
    has_entry_spot,
    is_lost,
    is_max,
    is_min,
    is_won,
    onSelect,
    latest_digit,
    selected_digit,
    status,
    stats,
    value,
    onLastDigitSpot,
}) => {
    const { digit, spot } = latest_digit;
    const is_latest = value === digit;
    const is_selected = value === barrier;
    const is_selected_winning = digit === barrier;
    const percentage = stats ? (stats * 100) / 1000 : null;

    React.useEffect(() => {
        if (onLastDigitSpot) {
            onLastDigitSpot({ spot, is_lost, is_selected_winning, is_latest, is_won });
        }
    }, [latest_digit, spot, barrier, value, is_lost, is_selected_winning, is_latest, is_won, onLastDigitSpot]);

    const is_digit_selectable = isMobile() && typeof onSelect === 'function' && !status;
    const is_digit_selected = isMobile() && value === selected_digit && !status;
    return (
        <div
            className={classNames('digits__digit', {
                'digits__digit--latest': is_latest,
                'digits__digit--win': is_won && is_latest,
                'digits__digit--loss': is_lost && is_latest,
                'digits__digit--is-selectable': is_digit_selectable,
                'digits__digit--is-selected': is_digit_selected,
            })}
            onClick={() => {
                if (!is_digit_selectable) return;
                onSelect(value);
            }}
        >
            <LastDigitStat is_min={is_min} is_max={is_max} is_selected={is_selected} percentage={percentage} />
            <DesktopWrapper>
                <Bounce
                    is_visible={!!(is_digit_contract && is_latest && spot && status && has_entry_spot)}
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
            </DesktopWrapper>
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
    barrier: PropTypes.number,
    has_entry_spot: PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    is_lost: PropTypes.bool,
    is_max: PropTypes.bool,
    is_min: PropTypes.bool,
    is_won: PropTypes.bool,
    latest_digit: PropTypes.object,
    onLastDigitSpot: PropTypes.func,
    onSelect: PropTypes.func,
    selected_digit: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    stats: PropTypes.number,
    status: PropTypes.string,
    value: PropTypes.number,
};

export default observer(DigitDisplay);

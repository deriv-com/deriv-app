import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import { localize } from 'App/i18n';
import { daysFromTodayTo } from 'Utils/Date';

const FooterIcon = (use_icon) => use_icon || 'IconCalendarToday';

const CalendarFooter = ({
    footer,
    has_range_selection,
    has_today_btn,
    onClick,
    use_icon,
    value,
}) => {
    let default_message, is_minimum;

    const duration  = daysFromTodayTo(value);
    if (duration) {
        default_message = `${duration} ${duration === 1 ? localize('Day') : localize('Days')}`;
        is_minimum = false;
    } else {
        default_message = localize('Minimum duration is 1 day');
        is_minimum = true;
    }

    return (
        <React.Fragment>
            { (has_today_btn || footer || has_range_selection) &&
                <div className='calendar__footer'>
                    { footer && <span className='calendar__text'>{footer}</span> }
                    { has_range_selection &&
                        <span className='calendar__text'>
                            { `${!is_minimum ? localize('Duration: ') : ''}${default_message}` }
                        </span>
                    }
                    { has_today_btn &&
                        <Icon
                            icon={FooterIcon(use_icon)}
                            className='calendar__icon'
                            onClick={onClick}
                        />
                    }
                </div>
            }
        </React.Fragment>
    );
};

CalendarFooter.propTypes = {
    footer             : PropTypes.string,
    has_range_selection: PropTypes.bool,
    has_today_btn      : PropTypes.bool,
    onClick            : PropTypes.func,
    use_icon           : PropTypes.string,
};

export default CalendarFooter;

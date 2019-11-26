import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';
import { localize } from 'deriv-translations';

const FooterIcon = (use_icon) => use_icon || 'IconCalendarToday';

const CalendarFooter = ({
    footer,
    has_today_btn,
    has_range_selection,
    duration_date,
    is_minimum,
    onClick,
    use_icon,
}) => (
    <React.Fragment>
        { (has_today_btn || footer || has_range_selection) &&
            <div className='calendar__footer'>
                { footer && <span className='calendar__text'>{footer}</span>}
                { has_range_selection && <span className='calendar__text'>{ `${!is_minimum ? localize('Duration: ') : ''}${duration_date}` }</span> }
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

CalendarFooter.propTypes = {
    duration_date      : PropTypes.string,
    footer             : PropTypes.string,
    has_range_selection: PropTypes.bool,
    has_today_btn      : PropTypes.bool,
    is_minimum         : PropTypes.bool,
    onClick            : PropTypes.func,
    use_icon           : PropTypes.string,
};

export default CalendarFooter;

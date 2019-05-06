import PropTypes             from 'prop-types';
import React                 from 'react';
import {
    Icon,
    IconCalendarToday }      from 'Assets/Common';
import { localize }          from '_common/localize';

const CalendarFooter = ({
    footer,
    has_today_btn,
    has_range_selection,
    duration_date,
    is_minimum,
    onClick,
}) => (
    <React.Fragment>
        { (has_today_btn || footer || has_range_selection) &&
            <div className='calendar__footer'>
                { footer && <span className='calendar__text'>{footer}</span>}
                { has_range_selection && <span className='calendar__text'>{ `${!is_minimum ? localize('Duration: ') : ''}${duration_date}` }</span> }
                { has_today_btn &&
                    <Icon
                        icon={IconCalendarToday}
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
};

export default CalendarFooter;

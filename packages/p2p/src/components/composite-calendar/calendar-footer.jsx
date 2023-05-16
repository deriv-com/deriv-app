import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import './calendar-footer.scss';

const CalendarFooter = ({ setIsOpen, applyDateRange }) => {
    return (
        <div className='calendar-footer'>
            <Button text={localize('Cancel')} onClick={() => setIsOpen(false)} has_effect secondary large />
            <Button text={localize('OK')} onClick={applyDateRange} has_effect primary large />
        </div>
    );
};

CalendarFooter.propTypes = {
    setIsOpen: PropTypes.func,
    applyDateRange: PropTypes.func,
};
export default CalendarFooter;

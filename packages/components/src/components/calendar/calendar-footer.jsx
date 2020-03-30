import PropTypes from 'prop-types';
import React from 'react';
import Button from './calendar-button.jsx';

const FooterIcon = use_icon => use_icon || 'IcCalendarToday';

const Footer = ({ footer, has_today_btn, onClick, use_icon }) => (
    <>
        {(has_today_btn || footer) && (
            <div className='dc-calendar__footer'>
                {footer && <span className='dc-calendar__text'>{footer}</span>}
                {has_today_btn && (
                    <Button className='dc-calendar__btn--today' icon={FooterIcon(use_icon)} onClick={onClick} />
                )}
            </div>
        )}
    </>
);

Footer.propTypes = {
    footer: PropTypes.string,
    has_today_btn: PropTypes.bool,
    onClick: PropTypes.func,
    use_icon: PropTypes.string,
};

export default Footer;

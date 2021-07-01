import PropTypes from 'prop-types';
import React from 'react';
import Button from './calendar-button.jsx';
import Text from '../text';

const FooterIcon = use_icon => use_icon || 'IcCalendarToday';

const Footer = ({ footer, has_today_btn, onClick, use_icon, has_clear_btn, clear_text, onClear }) => (
    <>
        {(has_today_btn || footer || has_clear_btn) && (
            <div className='dc-calendar__footer'>
                {footer && (
                    <Text size='xxs' align='center'>
                        {footer}
                    </Text>
                )}
                {has_today_btn && (
                    <Button className='dc-calendar__btn--today' icon={FooterIcon(use_icon)} onClick={onClick} />
                )}
                {has_clear_btn && (
                    <Button secondary small className='dc-calendar__btn' onClick={onClear} text={clear_text} />
                )}
            </div>
        )}
    </>
);

Footer.propTypes = {
    clear_text: PropTypes.string,
    footer: PropTypes.string,
    has_clear_btn: PropTypes.bool,
    has_today_btn: PropTypes.bool,
    onClick: PropTypes.func,
    onClear: PropTypes.func,
    use_icon: PropTypes.string,
};

export default Footer;

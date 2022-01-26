import React from 'react';
import Button from './calendar-button.jsx';
import Text from '../text';

type FooterProps = {
    clear_text: string;
    footer: string;
    has_clear_btn: boolean;
    has_today_btn: boolean;
    onClick: () => void;
    onClear: () => void;
    use_icon: string;
};

const FooterIcon = use_icon => use_icon || 'IcCalendarToday';

const Footer = ({ footer, has_today_btn, onClick, use_icon, has_clear_btn, clear_text, onClear }: FooterProps) => (
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

export default Footer;

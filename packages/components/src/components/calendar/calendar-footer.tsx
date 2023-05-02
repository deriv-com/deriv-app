import React from 'react';
import Button from './calendar-button';
import Text from '../text';

type TFooterProps = {
    clear_text?: string;
    footer: string;
    has_clear_btn?: boolean;
    has_today_btn: boolean;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    onClear?: React.MouseEventHandler<HTMLSpanElement>;
    use_icon?: string;
};

const FooterIcon = (use_icon?: string) => use_icon || 'IcCalendarToday';

const Footer = ({ footer, has_today_btn, onClick, use_icon, has_clear_btn, clear_text, onClear }: TFooterProps) => (
    <React.Fragment>
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
    </React.Fragment>
);

export default Footer;

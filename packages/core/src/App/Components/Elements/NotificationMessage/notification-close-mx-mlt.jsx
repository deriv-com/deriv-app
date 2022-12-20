import PropTypes from 'prop-types';
import React from 'react';
import { isMobile } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';

const NotificationCloseMxMlt = ({ header, message, secondary_btn, img_src, img_alt, onClose }) => (
    <div className='close-mx-mlt notification-banner'>
        <div className='notification-banner--left'>
            <Text as='h4' size={isMobile() ? 'xs' : 's'} weight='bold' className='notification-banner__title'>
                {header}
            </Text>
            <Text as='p' size={isMobile() ? 'xxs' : 'xs'} className='notification-banner__description' line_height='xs'>
                {message}
            </Text>
            {!!secondary_btn && (
                <div className='notification-banner__btn-wrapper'>
                    <Button className='notification-banner__btn' secondary small onClick={secondary_btn.onClick}>
                        {secondary_btn.text}
                    </Button>
                </div>
            )}
        </div>
        <div className='notification-banner--right'>
            <div className='notification-banner__bg' />
            <img className='notification-banner__img' src={img_src} alt={img_alt} />
            <Icon className='notification-banner__close-icon' icon='IcCloseLight' onClick={onClose} />
        </div>
    </div>
);

NotificationCloseMxMlt.propTypes = {
    header: PropTypes.string,
    img_alt: PropTypes.string,
    img_src: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    secondary_btn: PropTypes.shape({
        text: PropTypes.string,
        onClick: PropTypes.func,
    }),
};

export default NotificationCloseMxMlt;

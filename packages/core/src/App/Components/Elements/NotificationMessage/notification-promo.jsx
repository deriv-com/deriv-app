import React from 'react';
import { Button, Icon, Text } from '@deriv/components';

const NotificationPromo = ({ cta_btn, img_alt, img_src, message, onClose }) => {
    return (
        <div className='notification-promo'>
            <img className='notification-promo__img' src={img_src} alt={img_alt} />
            <div className='notification-promo--container'>
                <div className='notification-promo--left'>
                    <Text as='p' size='xxs' className='notification-promo__message'>
                        {message}
                    </Text>
                    {cta_btn && (
                        <Button className='notification-promo__btn' blue secondary small onClick={cta_btn.onClick}>
                            {cta_btn.text}
                        </Button>
                    )}
                </div>
                <div className='notification-promo--right'>
                    <Icon className='notification-promo__close-icon' icon='IcCloseLight' onClick={onClose} />
                </div>
            </div>
        </div>
    );
};

export default NotificationPromo;

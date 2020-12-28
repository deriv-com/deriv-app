import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const NotificationBanner = ({ onClick, header, message, button_text, img_src, img_alt, redirect_link }) => (
    <div className='notification-banner'>
        <div className='notification-banner--left'>
            <h4 className='notification-banner__title'>
                <Localize i18n_default_text={header} />
            </h4>
            <p className='notification-banner__description'>
                <Localize i18n_default_text={message} />
            </p>
            <StaticUrl href={redirect_link}>
                <Button className='notification-banner__btn' secondary onClick={onClick}>
                    {localize(button_text)}
                </Button>
            </StaticUrl>
        </div>
        <div className='notification-banner--right'>
            <div className='notification-banner__bg' />
            <img className='notification-banner__img' src={getUrlBase(img_src)} alt={img_alt} />
            <Icon className='notification-banner__icon' icon='IcCloseLight' onClick={onClick} />
        </div>
    </div>
);

NotificationBanner.propTypes = {
    button_text: PropTypes.string,
    header: PropTypes.string,
    img_alt: PropTypes.string,
    img_src: PropTypes.string,
    message: PropTypes.string,
    onClick: PropTypes.func,
    redirect_link: PropTypes.string,
};

export default NotificationBanner;

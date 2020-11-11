import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { getUrlBase } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const DP2PBanner = ({ onClick, header, message }) => (
    <div className='dp2p-banner'>
        <div className='dp2p-banner--left'>
            <div className='dp2p-banner__title'>
                <Localize i18n_default_text={header} />
            </div>
            <div className='dp2p-banner__description'>
                <Localize i18n_default_text={message} />
            </div>
            <StaticUrl href='/cashier/p2p/v1'>
                <Button className='dp2p-banner__btn' secondary onClick={onClick}>
                    {localize('Learn more')}
                </Button>
            </StaticUrl>
        </div>
        <div className='dp2p-banner--right'>
            <div className='dp2p-banner__bg' />
            <img className='dp2p-banner__img' src={getUrlBase('/public/images/common/dp2p_banner.png')} alt='DP2P' />
            <Icon className='dp2p-banner__icon' icon='IcCloseLight' onClick={onClick} />
        </div>
    </div>
);

DP2PBanner.prototype = {
    header: PropTypes.string,
    message: PropTypes.string,
    onClick: PropTypes.func,
};

export default DP2PBanner;

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const DP2PBanner2 = ({ onClick, is_open, header, message }) => (
    <div className='dp2p-banner'>
        <div className='dp2p-banner__left'>
            <div className='dp2p-banner__title'>
                <Localize i18n_default_text={header} />
            </div>
            <div className='dp2p-banner__description'>
                <Localize i18n_default_text={message} />
            </div>
            <StaticUrl href='/cashier/p2p/v1'>
                <Button className='dp2p-banner__btn-accept' secondary onClick={onClick}>
                    {localize('Learn more')}
                </Button>
            </StaticUrl>
        </div>
        <div className='dp2p-banner__right'>
            <div className='dp2p-banner__right-bg'></div>
            <img src='./src/App/Components/Elements/DP2PBanner/dp2p_banner.png' alt='DP2P'></img>
            <Icon className='dp2p-banner__right-icon' icon='IcCloseLight' onClick={onClick} />
        </div>
    </div>
);

DP2PBanner2.prototype = {
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
};

export default DP2PBanner2;

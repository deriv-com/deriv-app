import React from 'react';
import { isMobile } from '@deriv/shared';
import Text from '../../text';

const FooterItem = ({ info, getFontColor, label }) => {
    return (
        <div className='dc-app-card__footer-info'>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'}>
                {label}
            </Text>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'} weight='bold'>
                {info}
            </Text>
        </div>
    );
};

const AppCardFooter = ({ broker, getFontColor, login_id, server, variant }) => (
    <div className={`dc-app-card__footer-wrapper dc-app-card__footer-wrapper-${variant}`}>
        <FooterItem info={login_id} getFontColor={getFontColor} label='Login ID' />
        <FooterItem info={broker} getFontColor={getFontColor} label='Broker' />
        <FooterItem info={server} getFontColor={getFontColor} label='Server' />
    </div>
);

export default AppCardFooter;

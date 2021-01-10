import React from 'react';
import { isMobile } from '@deriv/shared';
import Text from '../../text';

const FooterItem = ({ info, getFontColor, label }) => {
    return (
        <div className='dc-app-card-footer__info'>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'}>
                {label}
            </Text>
            <Text color={getFontColor()} size={isMobile() ? 'xxxxs' : 'xxxs'} weight='bold'>
                {info}
            </Text>
        </div>
    );
};

const AppCardFooter = ({ broker, getCardLabels, getFontColor, login_id, server, variant }) => (
    <div className={`dc-app-card-footer__wrapper dc-app-card-footer__wrapper--${variant}`}>
        <FooterItem info={login_id} getFontColor={getFontColor} label={getCardLabels().LOGIN_ID} />
        <FooterItem info={broker} getFontColor={getFontColor} label={getCardLabels().BROKER} />
        <FooterItem info={server} getFontColor={getFontColor} label={getCardLabels().SERVER} />
    </div>
);

export default AppCardFooter;

import React from 'react';
import Text from '../../text';

const FooterItem = ({ info, is_virtual, label }) => {
    return (
        <div className='dc-app-card__footer-info'>
            <Text color={is_virtual ? 'colored-background' : 'general'} size={isMobile() ? 'xxxxs' : 'xxxs'}>
                {label}
            </Text>
            <Text
                color={is_virtual ? 'colored-background' : 'general'}
                size={isMobile() ? 'xxxxs' : 'xxxs'}
                weight='bold'
            >
                {info}
            </Text>
        </div>
    );
};

const AppCardFooter = ({ broker, is_virtual, login_id, server, variant }) => (
    <div className={`dc-app-card__footer-wrapper dc-app-card__footer-wrapper-${variant}`}>
        <FooterItem info={login_id} is_virtual={is_virtual} label='Login ID' />
        <FooterItem info={broker} is_virtual={is_virtual} label='Broker' />
        <FooterItem info={server} is_virtual={is_virtual} label='Server' />
    </div>
);

export default AppCardFooter;

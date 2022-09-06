import React from 'react';
import { isMobile } from '@deriv/shared';
import Text from '../../text';

type TAppCardFooterItemProps = {
    info: string;
    getFontColor: () => string;
    label: string;
};

const AppCardFooterItem = ({ info, getFontColor, label }: TAppCardFooterItemProps) => {
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

export default AppCardFooterItem;

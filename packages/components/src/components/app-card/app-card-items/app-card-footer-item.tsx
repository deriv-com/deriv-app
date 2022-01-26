import React from 'react';
import { isMobile } from '@deriv/shared';
import Text from '../../text';

type AppCardFooterItemProps = {
    info: string;
    getFontColor: () => void;
    label: string;
};

const AppCardFooterItem = ({ info, getFontColor, label }: AppCardFooterItemProps) => {
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

import * as React from 'react';
import { Text, Icon } from '@deriv/components';

const AppToTradeBenefit: React.FC<TAppToTradeBenefitProps> = ({ icon, description }) => {
    return (
        <div className='dw-app-to-trade__benefit'>
            <Icon icon={icon} size={32} className='dw-app-to-trade__benefit-icon' />
            <Text size='xs' line_height='m'>
                {description}
            </Text>
        </div>
    );
};

type TAppToTradeBenefitProps = {
    icon: string;
    description: string;
};

export default AppToTradeBenefit;

import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';

const AppToTradeBenefit: React.FC<TAppToTradeBenefitProps> = ({ icon, description }) => {
    return (
        <React.Fragment>
            <div className='template__app-to-trade-benefit'>
                <Icon icon={icon} size={32} />
                <Text size='xs' line_height='xl'>
                    {description}
                </Text>
            </div>
        </React.Fragment>
    );
};

type TAppToTradeBenefitProps = {
    icon: string;
    description: string;
};

export default observer(AppToTradeBenefit);

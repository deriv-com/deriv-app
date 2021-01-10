import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';

const Indice: React.FC<TIndiceProps> = ({ icon, description }) => {
    return (
        <React.Fragment>
            <div className='template__indice'>
                <Icon icon={icon} size={40} className='template__indice-icon' />
                <Text size='xs' line_height='xl'>
                    {description}
                </Text>
            </div>
        </React.Fragment>
    );
};

type TIndiceProps = {
    icon: string;
    description: string;
};

export default observer(Indice);

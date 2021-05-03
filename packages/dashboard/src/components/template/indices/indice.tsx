import * as React from 'react';
import { Text, Icon } from '@deriv/components';

const Indice: React.FC<TIndiceProps> = ({ icon, description }) => {
    return (
        <div className='dw-indices__indice'>
            <Icon icon={icon} size={40} className='dw-indices__indice-icon' />
            <Text size='xs' line_height='xl'>
                {description}
            </Text>
        </div>
    );
};

type TIndiceProps = {
    icon: string;
    description: string;
};

export default Indice;

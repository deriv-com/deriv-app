import * as React from 'react';
import { Text, Icon } from '@deriv/components';

const Pair: React.FC<TPairProps> = ({ icon, description }) => {
    return (
        <div className='dw-instruments__pair'>
            <Icon icon={icon} size={30} className='dw-instruments__pair-icon' />
            <Text size='xs' line_height='xl'>
                {description}
            </Text>
        </div>
    );
};

type TPairProps = {
    icon: string;
    description: string;
};

export default Pair;

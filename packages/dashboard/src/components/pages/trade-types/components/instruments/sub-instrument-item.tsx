import * as React from 'react';
import { Text, Icon } from '@deriv/components';

const SubInstrumentItem: React.FC<TSubInstrumentItemProps> = ({ icon, description }) => {
    return (
        <div className='dw-instruments__sub-instrument-item'>
            <Icon icon={icon} size={40} className='dw-instruments__sub-instrument-item-icon' />
            <Text size='xs' line_height='xl'>
                {description}
            </Text>
        </div>
    );
};

type TSubInstrumentItemProps = {
    icon: string;
    description: string;
    key: number;
};

export default SubInstrumentItem;

import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';

const Pair: React.FC<TPairProps> = ({ icon, description }) => {
    return (
        <React.Fragment>
            <div className='dw-element-template__pair'>
                <Icon icon={icon} size={30} className='dw-element-template__pair-icon' />
                <Text size='xs' line_height='xl'>
                    {description}
                </Text>
            </div>
        </React.Fragment>
    );
};

type TPairProps = {
    icon: string;
    description: string;
};

export default observer(Pair);

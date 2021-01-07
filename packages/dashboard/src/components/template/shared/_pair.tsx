import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';

const Pair: React.FC<TPairProps> = ({ icon, title }) => {
    return (
        <React.Fragment>
            <div className='template__pair'>
                <Icon icon={icon} size={30} />
                <Text size='xs' line_height='xl'>
                    {title}
                </Text>
            </div>
        </React.Fragment>
    );
};

type TPairProps = {
    icon: string;
    title: string;
};

export default observer(Pair);

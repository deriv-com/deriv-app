import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const Back: React.FC<IBackProps> = ({ onClick }) => {
    return (
        <div className='dw-back' onClick={onClick}>
            <Icon className='dw-back__icon' icon='IcArrowLeftBold' width='16' height='16' />
            <Text>{localize('Back')}</Text>
        </div>
    );
};

interface IBackProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default Back;

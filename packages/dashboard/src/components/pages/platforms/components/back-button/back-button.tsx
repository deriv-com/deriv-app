import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const Back: React.FC<TBackProps> = ({ onClick }) => {
    return (
        <div className='dw-back' onClick={onClick}>
            <Icon className='dw-back__icon' icon='IcArrowLeftBold' width='16' height='16' />
            <Text>{localize('Back')}</Text>
        </div>
    );
};

type TBackProps = {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default Back;

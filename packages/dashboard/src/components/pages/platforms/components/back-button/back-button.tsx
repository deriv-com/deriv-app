import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const GetSection: React.FC = () => {
    return (
        <div className="dw-back">
            <Icon className="dw-back__icon" icon='IcArrowLeftBold' width='16' height='16' />
            <Text>{localize('Back')}</Text>
        </div>
    );
};

export default GetSection;

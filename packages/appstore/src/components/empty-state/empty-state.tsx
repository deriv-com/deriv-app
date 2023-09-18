import * as React from 'react';
import { Icon, Text } from '@deriv/components';

type TProps = {
    icon_name: string;
    renderMessage: () => React.ReactNode;
    renderTitle: () => React.ReactNode;
};

const EmptyState = ({ icon_name, renderMessage, renderTitle }: TProps) => {
    return (
        <div className='dw-empty-state'>
            <Icon className='dw-empty-state__icon' icon={icon_name} size={128} />
            <div className='dw-empty-state__content'>
                <Text align='center' as='p' color='disabled' line_height='m' size='s' weight='bold'>
                    {renderTitle()}
                </Text>
                <Text align='center' as='p' color='disabled' line_height='m' size='xs'>
                    {renderMessage()}
                </Text>
            </div>
        </div>
    );
};

export default EmptyState;

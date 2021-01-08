import * as React from 'react';
import { Icon, Text } from '@deriv/components';

const EmptyState: React.FC<TEmptyStateProps> = ({ icon_name, renderMessage, renderTitle }) => {
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

type TEmptyStateProps = {
    icon_name: string;
    renderMessage: () => React.ReactNode;
    renderTitle: () => React.ReactNode;
};

export default EmptyState;

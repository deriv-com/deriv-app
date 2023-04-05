import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';

type TDescription = {
    id: string;
    description: string;
};

const Description = ({ id, description }: TDescription) => (
    <React.Fragment>
        {id === 'type-strategy' && (
            <div key='description' className='quick-strategy__text'>
                <Text size={isMobile() ? 'xxs' : 's'} align='justify'>
                    {description}
                </Text>
            </div>
        )}
    </React.Fragment>
);

Description.displayName = 'Description';

export default React.memo(Description);
